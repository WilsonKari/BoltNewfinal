import React from 'react';
import { InterviewQuestion } from '../../lib/types';
import { QuestionView } from './QuestionView';

interface QuestionsListProps {
    questions: InterviewQuestion[];
    currentQuestionIndex: number;
}

export const QuestionsList: React.FC<QuestionsListProps> = ({
    questions,
    currentQuestionIndex
}) => {
    return (
        <div className="space-y-8">
            {questions.map((question, index) => (
                <div
                    key={question.id}
                    className={`transition-all duration-500 ease-in-out ${index <= currentQuestionIndex
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform translate-y-4 hidden'
                        }`}
                >
                    <div className={`rounded-lg border ${index === currentQuestionIndex
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700'
                        } p-6`}>
                        {/* Número de pregunta */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Pregunta {index + 1} de {questions.length}
                            </span>
                            {question.analysis && (
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${question.analysis.score >= 80
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                        : question.analysis.score >= 60
                                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    Score: {question.analysis.score}%
                                </span>
                            )}
                        </div>

                        {/* Pregunta */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">
                                {question.question}
                            </h3>
                        </div>

                        {/* Respuesta y Análisis */}
                        {question.answer && (
                            <div className="mt-4 space-y-4">
                                <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
                                    <h4 className="text-sm font-medium mb-2">Tu respuesta:</h4>
                                    <p className="text-gray-700 dark:text-gray-300">
                                        {question.answer}
                                    </p>
                                </div>

                                {question.analysis && (
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded p-4">
                                        <h4 className="text-sm font-medium mb-2">Análisis:</h4>
                                        <div className="space-y-2">
                                            <div>
                                                <h5 className="text-sm font-medium text-green-600 dark:text-green-400">
                                                    Fortalezas:
                                                </h5>
                                                <ul className="list-disc list-inside text-sm">
                                                    {question.analysis.strengths.map((strength, i) => (
                                                        <li key={i}>{strength}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                                    Áreas de mejora:
                                                </h5>
                                                <ul className="list-disc list-inside text-sm">
                                                    {question.analysis.improvements.map((improvement, i) => (
                                                        <li key={i}>{improvement}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h5 className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    Retroalimentación general:
                                                </h5>
                                                <p className="text-sm">
                                                    {question.analysis.overallFeedback}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};