import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    BarChart as BarChartIcon,
    TrendingUp,
    Clock,
    Target,
    CheckCircle
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { InterviewSession } from '../../lib/types';

interface AnalyticsViewProps {
    session: InterviewSession;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ session }) => {
    const { t } = useTranslation();

    // Preparar datos para las gráficas
    const scoreData = session.questions.map((q, index) => {
        let timeSpent;
        if (index === session.questions.length - 1) {
            // Para la última pregunta, usar el tiempo de finalización de la sesión
            timeSpent = session.endTime ? (session.endTime - q.timestamp) / 1000 : 0;
        } else {
            // Para las demás preguntas, usar el timestamp de la siguiente pregunta
            timeSpent = (session.questions[index + 1].timestamp - q.timestamp) / 1000;
        }
    
        return {
            question: `Q${index + 1}`,
            score: q.analysis?.score || 0,
            timestamp: q.timestamp,
            timeSpent: timeSpent
        };
    });

    const averageScore = scoreData.reduce((acc, curr) => acc + curr.score, 0) / scoreData.length;

    // Datos de tiempo por pregunta
    // Modifica la preparación de timeData
    const timeData = scoreData.map(d => {
        const timeSpentMinutes = d.timeSpent ? Math.round(d.timeSpent / 60) : 0;
        return {
            question: d.question,
            minutes: timeSpentMinutes || 0, // Aseguramos que nunca sea NaN
            expected: session.difficulty.timePerQuestion
        };
    });

    return (
        <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium flex items-center">
                    <BarChartIcon className="w-5 h-5 mr-2" />
                    {t('interview.analytics')}
                </h3>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                        {t('interview.averageScore')}:
                    </span>
                    <span className={`font-medium ${averageScore >= 80 ? 'text-green-500' :
                        averageScore >= 60 ? 'text-yellow-500' :
                            'text-red-500'
                        }`}>
                        {Math.round(averageScore)}%
                    </span>
                </div>
            </div>

            {/* Score Progress Chart */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    {t('interview.scoreProgress')}
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={scoreData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="question" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="score"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', r: 4 }}
                                name={t('interview.score')}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Time per Question Chart */}
            <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {t('interview.timePerQuestion')}
                </h4>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="question" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="minutes"
                                fill="#3b82f6"
                                name={t('interview.actualTime')}
                            />
                            <Bar
                                dataKey="expected"
                                fill="#9ca3af"
                                name={t('interview.expectedTime')}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Target className="w-5 h-5 text-blue-500" />
                        <span className="text-2xl font-bold">
                            {session.questions.length}/{session.difficulty.questionsCount}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('interview.completedQuestions')}
                    </p>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-2xl font-bold">
                            {session.questions.filter(q =>
                                q.analysis && q.analysis.score >= 70
                            ).length}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('interview.goodAnswers')}
                    </p>
                </div>

                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-yellow-500" />
                        <span className="text-2xl font-bold">
                            {Math.max(0, Math.round(timeData.reduce((acc, curr) =>
                                acc + (curr.minutes || 0), 0
                            )))}m
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {t('interview.totalTime')}
                    </p>
                </div>
            </div>
        </div>
    );
};