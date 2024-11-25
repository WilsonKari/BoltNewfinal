import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, BarChart2, Clock, FileText, ChevronRight, Play, Printer } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DetailedAnalysisModal } from '../modals/DetailedAnalysisModal';
import { FinalAnalysis, InterviewSession } from '../../lib/types';
import { useStore } from '../../lib/store';

interface InterviewSummaryProps {
    session: InterviewSession;
    finalAnalysis: FinalAnalysis;
}

export const InterviewSummary: React.FC<InterviewSummaryProps> = ({
    session,
    finalAnalysis
}) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const resetInterview = useStore(state => state.resetInterview);

    const getDuration = () => {
        if (!session.startTime || !session.endTime) return '0m';
        const duration = session.endTime - session.startTime;
        const minutes = Math.floor(duration / 1000 / 60);
        return `${minutes}m`;
    };

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'text-green-500';
        if (score >= 75) return 'text-blue-500';
        if (score >= 60) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getCategoryBadge = (category: string) => {
        const variants: Record<string, string> = {
            excellent: 'success',
            good: 'primary',
            average: 'warning',
            poor: 'error'
        };
        return variants[category] || 'primary';
    };

    const handlePrint = () => {
        setIsModalOpen(true); // Abre el modal
        // Espera a que el modal se abra y luego imprime
        setTimeout(() => {
            window.print();
        }, 100);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6 print:shadow-none print:dark:bg-white print:dark:text-black">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold flex items-center">
                        <Award className="w-6 h-6 mr-2 print:text-black" />
                        {t('interview.interviewComplete')}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-gray-400 print:text-black" />
                        <span className="text-gray-600 dark:text-gray-400 print:text-black">
                            {getDuration()}
                        </span>
                    </div>
                </div>

                {/* Score Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Average Score */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-400 print:text-black">
                                {t('interview.averageScore')}
                            </span>
                            <span className={`text-2xl font-bold ${getScoreColor(finalAnalysis.averageScore)}`}>
                                {finalAnalysis.averageScore}%
                            </span>
                        </div>
                        <Badge variant={getCategoryBadge(finalAnalysis.scoreCategory)}>
                            {t(`interview.scoreCategory.${finalAnalysis.scoreCategory}`)}
                        </Badge>
                    </div>

                    {/* Questions Completed */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-400 print:text-black">
                                {t('interview.questionsCompleted')}
                            </span>
                            <span className="text-2xl font-bold">
                                {finalAnalysis.completedQuestions}/{finalAnalysis.totalQuestions}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 print:bg-gray-300">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                    width: `${(finalAnalysis.completedQuestions / finalAnalysis.totalQuestions) * 100}%`
                                }}
                            />
                        </div>
                    </div>

                    {/* Performance Level */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 print:bg-white print:border print:border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600 dark:text-gray-400 print:text-black">
                                {t('interview.performanceLevel')}
                            </span>
                            <BarChart2 className="w-5 h-5 text-blue-500 print:text-black" />
                        </div>
                        <div className="space-y-2">
                            <Badge variant="success" className="mr-2">
                                {session.difficulty.label[t('common.lang')]}
                            </Badge>
                            <Badge variant="secondary">
                                {session.career.label[t('common.lang')]}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Quick Summary */}
                <div className="space-y-4">
                    <h4 className="font-medium text-sm text-gray-600 dark:text-gray-400 print:text-black">
                        {t('interview.quickSummary')}
                    </h4>
                    <p className="text-gray-700 dark:text-gray-300 print:text-black">
                        {finalAnalysis.overallFeedback}
                    </p>
                </div>

                {/* Actions - Ocultar en impresión */}
                <div className="flex justify-end pt-4 space-x-4 print:hidden">
                    {/* Botón para reiniciar */}
                    <Button
                        onClick={resetInterview}
                        className="flex items-center"
                        variant="secondary"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        {t('interview.startNewInterview')}
                    </Button>

                    {/* Botón para imprimir */}
                    <Button
                        onClick={handlePrint}
                        className="flex items-center"
                        variant="secondary"
                    >
                        <Printer className="w-4 h-4 mr-2" />
                        {t('interview.printAnalysis')}
                    </Button>

                    {/* Botón de ver análisis detallado */}
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center"
                        variant="primary"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('interview.viewDetailedAnalysis')}
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>

            <DetailedAnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                session={session}
                analysis={finalAnalysis}
            />
        </>
    );
};