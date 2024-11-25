import { InterviewSession, FinalAnalysis, InterviewQuestion } from '../types';
import { ApiConfig } from '../types';

export class AnalysisService {
    private static calculateAverageScore(questions: InterviewQuestion[]): number {
        const answeredQuestions = questions.filter(q => q.analysis);
        if (answeredQuestions.length === 0) return 0;

        const totalScore = answeredQuestions.reduce(
            (sum, q) => sum + (q.analysis?.score || 0),
            0
        );
        return Math.round(totalScore / answeredQuestions.length);
    }

    private static findCommonPatterns(questions: InterviewQuestion[]): {
        strengths: string[];
        improvements: string[];
    } {
        const allStrengths = questions
            .filter(q => q.analysis)
            .flatMap(q => q.analysis!.strengths);

        const allImprovements = questions
            .filter(q => q.analysis)
            .flatMap(q => q.analysis!.improvements);

        // Función auxiliar para contar frecuencias
        const countFrequency = (arr: string[]) => {
            return arr.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);
        };

        // Obtener los más frecuentes
        const getTopItems = (items: Record<string, number>, count: number = 3) => {
            return Object.entries(items)
                .sort(([, a], [, b]) => b - a)
                .slice(0, count)
                .map(([item]) => item);
        };

        return {
            strengths: getTopItems(countFrequency(allStrengths)),
            improvements: getTopItems(countFrequency(allImprovements))
        };
    }

    static async generateFinalAnalysis(
        session: InterviewSession,
        config: ApiConfig,
        language: string
    ): Promise<FinalAnalysis> {
        const averageScore = this.calculateAverageScore(session.questions);
        const patterns = this.findCommonPatterns(session.questions);

        const prompt = language === 'es'
            ? `Analiza la siguiente sesión de entrevista y proporciona un resumen detallado. Responde SOLO con el JSON solicitado, sin markdown ni backticks:

Posición: ${session.career.label.es}
Nivel: ${session.difficulty.label.es}
Puntuación promedio: ${averageScore}%
Fortalezas principales: ${patterns.strengths.join(', ')}
Áreas de mejora principales: ${patterns.improvements.join(', ')}

Preguntas y respuestas:
${session.questions.map((q, i) => `
Pregunta ${i + 1}: ${q.question}
Respuesta: ${q.answer || 'No contestada'}
Puntuación: ${q.analysis?.score || 0}%
`).join('\n')}

Proporciona el siguiente JSON:
{
  "averageScore": ${averageScore},
  "totalQuestions": ${session.difficulty.questionsCount},
  "completedQuestions": ${session.questions.filter(q => q.analysis).length},
  "strongAreas": ["área fuerte 1", "área fuerte 2", "área fuerte 3"],
  "improvementAreas": ["área a mejorar 1", "área a mejorar 2", "área a mejorar 3"],
  "overallFeedback": "retroalimentación detallada aquí",
  "scoreCategory": "${averageScore >= 90 ? 'excellent' : averageScore >= 75 ? 'good' : averageScore >= 60 ? 'average' : 'poor'}"
}`
            : `Analyze the following interview session and provide a detailed summary. Respond ONLY with the requested JSON, no markdown or backticks:

Position: ${session.career.label.en}
Level: ${session.difficulty.label.en}
Average Score: ${averageScore}%
Main Strengths: ${patterns.strengths.join(', ')}
Main Improvement Areas: ${patterns.improvements.join(', ')}

Questions and Answers:
${session.questions.map((q, i) => `
Question ${i + 1}: ${q.question}
Answer: ${q.answer || 'Not answered'}
Score: ${q.analysis?.score || 0}%
`).join('\n')}

Provide the following JSON:
{
  "averageScore": ${averageScore},
  "totalQuestions": ${session.difficulty.questionsCount},
  "completedQuestions": ${session.questions.filter(q => q.analysis).length},
  "strongAreas": ["strong area 1", "strong area 2", "strong area 3"],
  "improvementAreas": ["improvement area 1", "improvement area 2", "improvement area 3"],
  "overallFeedback": "detailed feedback here",
  "scoreCategory": "${averageScore >= 90 ? 'excellent' : averageScore >= 75 ? 'good' : averageScore >= 60 ? 'average' : 'poor'}"
}`;

        try {
            const response = await fetch(`${config.baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${config.apiKey}`,
                },
                body: JSON.stringify({
                    model: config.modelId,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert interviewer providing analysis in clean JSON format only. Do not include markdown formatting or explanation text.'
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();

            // Limpiar la respuesta de markdown
            let contentToParse = data.choices[0].message.content;
            contentToParse = contentToParse.replace(/```json\s*/, '').replace(/```\s*$/, '');
            contentToParse = contentToParse.trim();

            try {
                const finalAnalysis = JSON.parse(contentToParse);

                // Validar la estructura
                if (!finalAnalysis.averageScore ||
                    !Array.isArray(finalAnalysis.strongAreas) ||
                    !Array.isArray(finalAnalysis.improvementAreas) ||
                    !finalAnalysis.overallFeedback) {
                    throw new Error('Invalid analysis format');
                }

                // Asegurar valores correctos
                finalAnalysis.averageScore = averageScore;
                finalAnalysis.totalQuestions = session.difficulty.questionsCount;
                finalAnalysis.completedQuestions = session.questions.filter(q => q.analysis).length;

                return finalAnalysis;
            } catch (parseError) {
                console.error('Error parsing AI response:', parseError);
                console.error('Raw response:', data.choices[0].message.content);
                throw new Error('Failed to parse AI response');
            }
        } catch (error) {
            console.error('Error generating final analysis:', error);
            throw error;
        }
    }

    static getScoreCategory(score: number): 'poor' | 'average' | 'good' | 'excellent' {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'average';
        return 'poor';
    }
}