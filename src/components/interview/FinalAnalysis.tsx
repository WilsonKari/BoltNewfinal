import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    Award,
    TrendingUp,
    Target,
    CheckCircle,
    AlertCircle,
    BarChart,
    Clock
} from 'lucide-react';
import { FinalAnalysis as FinalAnalysisType } from '../../lib/types';
import { Badge } from '../ui/Badge';

interface FinalAnalysisProps {
    analysis: FinalAnalysisType;
    onClose?: () => void;
    duration: number;
}

export const FinalAnalysis: React.FC<FinalAnalysisProps> = ({
    analysis,
    onClose,
    duration
}) => {
    const { t } = useTranslation();

    const formatDuration = (ms: number): string => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'text-green-500';
        if (score >= 75) return 'text-blue-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getCategoryBadge = (category: string) => {
        const variants: Record<string, any> = {
            excellent: { variant: 'success', icon: Award },
            good: { variant: 'primary', icon: CheckCircle },
            average: { variant: 'warning', icon: AlertCircle },
            poor: { variant: 'error', icon: AlertCircle }
        };

        const config = variants[category] || variants.average;
        const Icon = config.icon;

        return (
            <Badge variant={config.variant} className="text-sm">
                <Icon className="w-4 h-4 mr-1" />
                {t(`interview.scoreCategory.${category}`)}
            </Badge>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center">
                        <Target className="w-6 h-6 mr-2" />
                        {t('interview.finalAnalysis')}
                    </h2>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm text-gray-500">
                            {formatDuration(duration)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Score Overview */}
            <div className="p-6 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-gray-500 mb-1">{t('interview.averageScore')}</div>
                        <div className={`text-3xl font-bold ${getScoreColor(analysis.averageScore)}`}>
                            {analysis.averageScore}%
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 mb-1">{t('interview.completedQuestions')}</div>
                        <div className="text-3xl font-bold">
                            {analysis.completedQuestions}/{analysis.totalQuestions}
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-gray-500 mb-1">{t('interview.performanceLevel')}</div>
                        <div>
                            {getCategoryBadge(analysis.scoreCategory)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Strong Areas */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center text-green-600 dark:text-green-400">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        {t('interview.strongAreas')}
                    </h3>
                    <ul className="space-y-2">
                        {analysis.strongAreas.map((area, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircle className="w-5 h-5 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{area}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Areas for Improvement */}
                <div className="space-y-4">
                    <h3 className="font-semibold flex items-center text-blue-600 dark:text-blue-400">
                        <BarChart className="w-5 h-5 mr-2" />
                        {t('interview.improvementAreas')}
                    </h3>
                    <ul className="space-y-2">
                        {analysis.improvementAreas.map((area, index) => (
                            <li key={index} className="flex items-start">
                                <Target className="w-5 h-5 mr-2 text-blue-500 mt-0.5 flex-shrink-0" />
                                <span>{area}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Overall Feedback */}
            <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <h3 className="font-semibold mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    {t('interview.overallFeedback')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {analysis.overallFeedback}
                </p>
            </div>

            {/* Actions */}
            {onClose && (
                <div className="p-6 border-t dark:border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        {t('common.close')}
                    </button>
                </div>
            )}
        </div>
    );
};