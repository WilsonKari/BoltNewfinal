import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  CheckCircle,
  //AlertCircle,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { AnswerAnalysis as AnalysisType } from '../../lib/types';

interface AnswerAnalysisProps {
  analysis: AnalysisType;
}

export const AnswerAnalysis: React.FC<AnswerAnalysisProps> = ({ analysis }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-4">
      {/* Score Section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium">{t('interview.analysis')}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {t('interview.score')}:
          </span>
          <span
            className={`text-lg font-semibold ${
              analysis.score >= 80
                ? 'text-green-500'
                : analysis.score >= 60
                ? 'text-yellow-500'
                : 'text-red-500'
            }`}
          >
            {analysis.score}%
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Strengths */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
            {t('interview.strengths')}
          </h4>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="text-sm pl-6 relative">
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-green-500" />
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
            {t('interview.improvements')}
          </h4>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="text-sm pl-6 relative">
                <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-blue-500" />
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        {/* Overall Feedback */}
        <div>
          <h4 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <MessageCircle className="w-4 h-4 mr-2 text-purple-500" />
            {t('interview.overallFeedback')}
          </h4>
          <p className="text-sm pl-6">{analysis.overallFeedback}</p>
        </div>
      </div>
    </div>
  );
};
