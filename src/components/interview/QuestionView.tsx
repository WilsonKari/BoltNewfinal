import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MessageSquare } from 'lucide-react';
import { InterviewQuestion } from '../../lib/types';
import { Badge } from '../ui/Badge';
import { AnswerAnalysis } from './AnswerAnalysis';

interface QuestionViewProps {
    question: InterviewQuestion;
    isActive: boolean;
    questionNumber: number;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
    question,
    isActive,
    questionNumber,
}) => {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            {/* Question Header */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        {t('interview.question')} {questionNumber}
                    </h3>
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-500">
                            {new Date(question.timestamp).toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <p className="text-gray-700 dark:text-gray-300">
                    {question.question}
                </p>
            </div>

            {/* Answer Section */}
            {question.answer && (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">{t('interview.yourAnswer')}</h4>
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
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {question.answer}
                    </p>
                </div>
            )}

            {/* Analysis Section */}
            {question.analysis && (
                <div className="mt-8">
                    <AnswerAnalysis analysis={question.analysis} />
                </div>
            )}
        </div>
    );
};