import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ProgressBarProps {
    currentQuestion: number;
    totalQuestions: number;
    timeRemaining: number;
    difficulty: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    currentQuestion,
    totalQuestions,
    timeRemaining,
    difficulty
}) => {
    const { t } = useTranslation();
    const progress = (currentQuestion / totalQuestions) * 100;

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                    <Badge variant="primary">
                        {t('interview.questionProgress', {
                            current: currentQuestion,
                            total: totalQuestions
                        })}
                    </Badge>
                    <Badge variant={timeRemaining < 60 ? 'error' : 'secondary'}>
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(timeRemaining)}
                    </Badge>
                </div>
                <Badge variant="success">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    {difficulty}
                </Badge>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="mt-2 flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{t('interview.start')}</span>
                <span>{t('interview.finish')}</span>
            </div>
        </div>
    );
};