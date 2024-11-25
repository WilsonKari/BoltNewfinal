import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { useStore } from '../../lib/store';
import { InterviewQuestion } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface QuestionHistoryProps {
    onQuestionSelect: (index: number) => void;
    currentIndex: number;
}

export const QuestionHistory: React.FC<QuestionHistoryProps> = ({
    onQuestionSelect,
    currentIndex
}) => {
    const { t } = useTranslation();
    const { currentSession } = useStore();

    if (!currentSession) return null;

    const { questions, difficulty } = currentSession;

    return (
        <div className="border-b dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('interview.progress')}
                </h3>
                <Badge variant="primary">
                    {questions.length} / {difficulty.questionsCount}
                </Badge>
            </div>

            <div className="space-y-2">
                {questions.map((question: InterviewQuestion, index: number) => (
                    <button
                        key={question.id}
                        onClick={() => onQuestionSelect(index)}
                        className={`w-full text-left p-3 rounded-lg transition-colors ${index === currentIndex
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                            } flex items-start gap-3`}
                    >
                        <div className="mt-1">
                            {question.analysis ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                                <Circle className="h-5 w-5 text-gray-400" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    {t('interview.question')} {index + 1}
                                </span>
                                {question.analysis && (
                                    <Badge
                                        variant={
                                            question.analysis.score >= 80 ? 'success' :
                                                question.analysis.score >= 60 ? 'warning' : 'error'
                                        }
                                    >
                                        {question.analysis.score}%
                                    </Badge>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                {question.question}
                            </p>
                        </div>

                        <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                    </button>
                ))}
            </div>
        </div>
    );
};