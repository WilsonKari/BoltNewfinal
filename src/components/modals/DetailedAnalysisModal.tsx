import React from 'react';
import { useTranslation } from 'react-i18next';
import { X, Award, Clock, CheckCircle, AlertCircle, Printer } from 'lucide-react';
import { FinalAnalysis, InterviewSession } from '../../lib/types';
import { AnalyticsView } from '../interview/AnalyticsView';
import { Button } from '../ui/Button';

interface DetailedAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: InterviewSession;
    analysis: FinalAnalysis;
}

export const DetailedAnalysisModal: React.FC<DetailedAnalysisModalProps> = ({
    isOpen,
    onClose,
    session,
    analysis
}) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'text-green-500 print:text-green-700';
        if (score >= 75) return 'text-blue-500 print:text-blue-700';
        if (score >= 60) return 'text-yellow-500 print:text-yellow-700';
        return 'text-red-500 print:text-red-700';
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto print:static print:overflow-visible">
            <div className="flex items-center justify-center min-h-screen p-4 print:block print:min-h-0 print:p-0">
                {/* Backdrop - oculto en impresión */}
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity print:hidden"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full shadow-xl print:shadow-none print:dark:bg-white print:w-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b dark:border-gray-700 print:dark:border-gray-300">
                        <div className="flex items-center">
                            <Award className="w-6 h-6 mr-2 text-blue-500 print:text-black" />
                            <h2 className="text-xl font-semibold print:text-black">
                                {t('interview.detailedAnalysis')}
                            </h2>
                        </div>
                        {/* Botones solo visibles en pantalla */}
                        <div className="flex items-center space-x-2 print:hidden">
                            <Button
                                onClick={handlePrint}
                                variant="secondary"
                                className="mr-2"
                            >
                                <Printer className="w-4 h-4 mr-2" />
                                {t('interview.print')}
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-8">
                        {/* Interview Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-700 mb-2">
                                    {t('interview.position')}
                                </h3>
                                <p className="text-lg font-medium print:text-black">
                                    {session.career.label[t('common.lang')]}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-700 mb-2">
                                    {t('interview.level')}
                                </h3>
                                <p className="text-lg font-medium print:text-black">
                                    {session.difficulty.label[t('common.lang')]}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 print:text-gray-700 mb-2">
                                    {t('interview.duration')}
                                </h3>
                                <p className="text-lg font-medium flex items-center print:text-black">
                                    <Clock className="w-5 h-5 mr-2 print:text-black" />
                                    {Math.floor((session.endTime! - session.startTime) / 60000)}m
                                </p>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="border dark:border-gray-700 rounded-lg print:border-gray-300">
                            <AnalyticsView session={session} />
                        </div>

                        {/* Strengths and Improvements */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center text-green-600 dark:text-green-400 print:text-green-700">
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    {t('interview.strongAreas')}
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.strongAreas.map((area, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start text-gray-700 dark:text-gray-300 print:text-black"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2 flex-shrink-0" />
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Improvements */}
                            <div className="space-y-4">
                                <h3 className="font-medium flex items-center text-blue-600 dark:text-blue-400 print:text-blue-700">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    {t('interview.improvementAreas')}
                                </h3>
                                <ul className="space-y-2">
                                    {analysis.improvementAreas.map((area, index) => (
                                        <li
                                            key={index}
                                            className="flex items-start text-gray-700 dark:text-gray-300 print:text-black"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-2 flex-shrink-0" />
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Overall Feedback */}
                        <div className="space-y-4">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100 print:text-black">
                                {t('interview.overallFeedback')}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line print:text-black">
                                {analysis.overallFeedback}
                            </p>
                        </div>
                    </div>

                    {/* Footer - oculto en impresión */}
                    <div className="flex justify-end p-6 border-t dark:border-gray-700 print:hidden">
                        <Button onClick={onClose} variant="secondary">
                            {t('common.close')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};