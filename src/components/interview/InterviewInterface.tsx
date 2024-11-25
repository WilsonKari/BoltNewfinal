import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, Play, Send } from 'lucide-react';
import { Button } from '../ui/Button';
import { CareerSelect } from './CareerSelect';
import { DifficultySelect } from './DifficultySelect';
import { QuestionHistory } from './QuestionHistory';
import { QuestionsList } from './QuestionsList';
import { ProgressBar } from './ProgressBar';
import { InterviewSummary } from './InterviewSummary';
import { useStore, selectIsLastQuestion } from '../../lib/store';
import { Career } from '../../lib/careers';
import { Difficulty } from '../../lib/difficulties';
import { useTimer } from '../../hooks/useTimer';
import {
  getNextQuestion,
  synthesizeSpeech,
  analyzeAnswer,
  generateFinalAnalysis
} from '../../lib/api';
import { AnswerAnalysis as AnalysisType } from '../../lib/types';

export const InterviewInterface: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingFinal, setIsGeneratingFinal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [timerError, setTimerError] = useState<string | null>(null);
  const {
    apiConfig,
    startNewSession,
    updateCurrentQuestion,
    addNewQuestion,
    currentSession,
    isInterviewComplete,
    completeCurrentSession
  } = useStore();

  const isLastQuestion = selectIsLastQuestion(useStore.getState());

  // Timer setup
  const { timeRemaining, startTimer, resetTimer } = useTimer({
    initialTime: selectedDifficulty?.timePerQuestion * 60 || 300,
    onTimeEnd: () => {
        setTimerError(t('interview.timeEnded'));
    }
});

  useEffect(() => {
    // Limpiar el error del timer cuando cambie la pregunta o se reinicie
    if (!currentQuestion) {
      setTimerError(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (currentSession?.questions.length) {
      setActiveQuestionIndex(currentSession.questions.length - 1);
    }
  }, [currentSession?.questions.length]);

  const handleQuestionSelect = (index: number) => {
    setActiveQuestionIndex(index);
    const question = currentSession?.questions[index];
    if (question) {
      setCurrentQuestion(question.question);
      setAnswer(question.answer || '');
      setAnalysis(question.analysis || null);
      setAnswerError(null);
    }
  };

  const generateFinalResults = async () => {
    if (!currentSession || !apiConfig) return;

    setIsGeneratingFinal(true);
    try {
      const finalAnalysis = await generateFinalAnalysis(
        currentSession,
        apiConfig,
        i18n.language
      );
      completeCurrentSession(finalAnalysis);
    } catch (error) {
      console.error('Error generating final analysis:', error);
      setError(t('error.finalAnalysisError'));
    } finally {
      setIsGeneratingFinal(false);
    }
  };

  const startInterview = async () => {
    if (!selectedCareer || !selectedDifficulty) return;

    if (!apiConfig.baseUrl || !apiConfig.apiKey || !apiConfig.modelId) {
      setError(t('error.missingApiConfig'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswerError(null);
    setAnswer('');
    setAnalysis(null);
    resetTimer();

    try {
      // Solo iniciar nueva sesión si no hay una activa
      if (!currentSession) {
        startNewSession(selectedCareer, selectedDifficulty);
      }

      const previousQuestions = currentSession?.questions.map(q => q.question) || [];

      const newQuestion = await getNextQuestion(
        selectedCareer,
        selectedDifficulty,
        apiConfig,
        i18n.language,
        previousQuestions
      );

      // Agregar nueva pregunta
      addNewQuestion({
        question: newQuestion,
        timestamp: Date.now()
      });

      setCurrentQuestion(newQuestion);
      startTimer();

      if (apiConfig.elevenLabsKey) {
        const audioBlob = await synthesizeSpeech(
          newQuestion,
          apiConfig.elevenLabsKey,
          i18n.language
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        await audio.play();
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setError(t('error.questionError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || !selectedCareer || !currentQuestion || !selectedDifficulty) return;

    setAnswerError(null);
    setError(null);

    if (answer.trim().length < selectedDifficulty.minimumAnswerLength) {
      setAnswerError(
        t('error.answerTooShort', {
          min: selectedDifficulty.minimumAnswerLength
        })
      );
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analyzeAnswer(
        currentQuestion,
        answer,
        selectedCareer,
        selectedDifficulty,
        apiConfig,
        i18n.language
      );

      setAnalysis(result);

      // Actualizar la pregunta actual con la respuesta y el análisis
      updateCurrentQuestion({
        answer: answer,
        analysis: result
      });

      // Si es la última pregunta, generar el análisis final
      if (getRemainingQuestions() > 0) {
        setAnswer('');
        setAnalysis(null);
      }

    } catch (error) {
      console.error('Error analyzing answer:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t('error.analysisError'));
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const getRemainingQuestions = () => {
    if (!currentSession || !selectedDifficulty) return 0;
    return selectedDifficulty.questionsCount - currentSession.questions.length;
  };

  // Mostrar el resumen si la entrevista está completa
  if (isInterviewComplete && currentSession?.finalAnalysis) {
    return (
      <div className="container mx-auto px-4 py-8">
        <InterviewSummary
          session={currentSession}
          finalAnalysis={currentSession.finalAnalysis}
        />
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
          {/* Career and Difficulty Selection Section */}
          <div className="p-6 border-b dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6">
              {t('interview.setup')}
            </h2>

            <div className="space-y-6">
              <CareerSelect
                value={selectedCareer}
                onChange={setSelectedCareer}
                disabled={isLoading || isAnalyzing}
              />

              {selectedCareer && (
                <DifficultySelect
                  value={selectedDifficulty}
                  onChange={setSelectedDifficulty}
                  disabled={isLoading || isAnalyzing}
                />
              )}

{!currentQuestion && selectedCareer && selectedDifficulty && (
    <div className="mt-6 flex justify-center">
        <Button
            onClick={startInterview}
            disabled={!selectedCareer || !selectedDifficulty || isLoading}
            isLoading={isLoading}
            size="lg"
        >
            <Play className="h-5 w-5 mr-2" />
            {t('interview.start')}
        </Button>
    </div>
)}
            </div>
          </div>

          {/* Progress Bar and Question History */}
          {currentSession && selectedDifficulty && (
            <>
              <div className="p-4 border-b dark:border-gray-700">
                <ProgressBar
                  currentQuestion={currentSession.questions.length}
                  totalQuestions={selectedDifficulty.questionsCount}
                  timeRemaining={timeRemaining}
                  difficulty={selectedDifficulty.label[i18n.language]}
                />
              </div>
              <QuestionHistory
                onQuestionSelect={handleQuestionSelect}
                currentIndex={activeQuestionIndex}
              />
            </>
          )}

          {/* Error Messages */}
          {error && (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
        {error}
    </div>
)}
{timerError && (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400">
        {timerError}
    </div>
)}

          {/* Interview Section with Questions List */}
          {currentQuestion && currentSession && (
            <div className="p-6">
              <QuestionsList
                questions={currentSession.questions}
                currentQuestionIndex={activeQuestionIndex}
              />

              {/* Answer Form - Solo mostrar si hay una pregunta activa sin responder */}
              {activeQuestionIndex === currentSession.questions.length - 1 &&
                currentQuestion &&
                !currentSession?.questions[activeQuestionIndex]?.analysis && (
                  <form onSubmit={handleSubmitAnswer} className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('interview.yourAnswer')}
                        {selectedDifficulty && (
                          <span className="text-sm text-gray-500 ml-2">
                            ({t('interview.minLength', { min: selectedDifficulty.minimumAnswerLength })})
                          </span>
                        )}
                      </label>
                      <textarea
                        value={answer}
                        onChange={(e) => {
                          setAnswer(e.target.value);
                          setAnswerError(null);
                        }}
                        className={`w-full rounded-md border ${answerError
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                          } bg-white dark:bg-gray-700 p-4 min-h-[120px]`}
                        placeholder={t('interview.answerPlaceholder')}
                        disabled={isAnalyzing}
                      />
                      {answerError && (
                        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                          {answerError}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-center">
                      <Button
                        type="submit"
                        disabled={!answer.trim() || isAnalyzing}
                        isLoading={isAnalyzing}
                        variant="primary"
                      >
                        <Send className="h-5 w-5 mr-2" />
                        {t('interview.submitAnswer')}
                      </Button>

                      <Button
                        variant={isRecording ? 'destructive' : 'secondary'}
                        onClick={toggleRecording}
                        type="button"
                        disabled={!currentQuestion || isLoading || isAnalyzing}
                      >
                        {isRecording ? (
                          <MicOff className="h-5 w-5 mr-2" />
                        ) : (
                          <Mic className="h-5 w-5 mr-2" />
                        )}
                        {isRecording
                          ? t('interview.stopRecording')
                          : t('interview.startRecording')}
                      </Button>
                    </div>
                  </form>
                )}

              {/* Next Question Button - Mostrar solo después de analizar la respuesta */}
              {activeQuestionIndex === currentSession.questions.length - 1 &&
                currentSession?.questions[activeQuestionIndex]?.analysis &&
                getRemainingQuestions() > 0 && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={startInterview}
                      type="button"
                      variant="secondary"
                      disabled={isLoading}
                      className="transition-all duration-300 opacity-100 hover:scale-105"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {t('interview.nextQuestion')}
                      <span className="ml-2 text-sm">
                        ({getRemainingQuestions()} {t('interview.remaining')})
                      </span>
                    </Button>
                  </div>
                )}

              {/* Generate Final Analysis Button - Solo mostrar en la última pregunta después de analizarla */}
              {isLastQuestion &&
                currentSession?.questions[activeQuestionIndex]?.analysis && (
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={generateFinalResults}
                      disabled={isGeneratingFinal}
                      isLoading={isGeneratingFinal}
                      variant="secondary"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      {t('interview.generateFinalAnalysis')}
                    </Button>
                  </div>
                )}

              {/* Loading State para Análisis Final */}
              {isGeneratingFinal && (
                <div className="mt-6 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('interview.generatingFinalAnalysis')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};