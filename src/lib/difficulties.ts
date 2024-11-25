export interface Difficulty {
    id: string;
    label: {
        en: string;
        es: string;
    };
    questionsCount: number;
    timePerQuestion: number; // en minutos
    minimumAnswerLength: number; // en caracteres
    scoreThresholds: {
        poor: number;
        average: number;
        good: number;
        excellent: number;
    };
    promptModifier: {
        en: string;
        es: string;
    };
}

export const difficulties: Difficulty[] = [
    {
        id: 'beginner',
        label: {
            en: 'Beginner',
            es: 'Principiante'
        },
        questionsCount: 3,
        timePerQuestion: 5,
        minimumAnswerLength: 100,
        scoreThresholds: {
            poor: 40,
            average: 60,
            good: 75,
            excellent: 85
        },
        promptModifier: {
            en: 'Focus on basic concepts and fundamental knowledge. Ask entry-level questions.',
            es: 'Enfócate en conceptos básicos y conocimientos fundamentales. Haz preguntas de nivel inicial.'
        }
    },
    {
        id: 'intermediate',
        label: {
            en: 'Intermediate',
            es: 'Intermedio'
        },
        questionsCount: 5,
        timePerQuestion: 8,
        minimumAnswerLength: 150,
        scoreThresholds: {
            poor: 50,
            average: 70,
            good: 80,
            excellent: 90
        },
        promptModifier: {
            en: 'Include practical scenarios and specific technical knowledge. Questions should require detailed explanations.',
            es: 'Incluye escenarios prácticos y conocimientos técnicos específicos. Las preguntas deben requerir explicaciones detalladas.'
        }
    },
    {
        id: 'advanced',
        label: {
            en: 'Advanced',
            es: 'Avanzado'
        },
        questionsCount: 7,
        timePerQuestion: 10,
        minimumAnswerLength: 200,
        scoreThresholds: {
            poor: 60,
            average: 75,
            good: 85,
            excellent: 95
        },
        promptModifier: {
            en: 'Focus on complex scenarios, system design, and advanced problem-solving. Include questions about best practices and architecture decisions.',
            es: 'Enfócate en escenarios complejos, diseño de sistemas y resolución avanzada de problemas. Incluye preguntas sobre mejores prácticas y decisiones de arquitectura.'
        }
    }
];

export function getDifficulty(id: string): Difficulty | undefined {
    return difficulties.find(diff => diff.id === id);
}

export function getScoreCategory(score: number, difficulty: Difficulty): 'poor' | 'average' | 'good' | 'excellent' {
    const { scoreThresholds } = difficulty;
    if (score >= scoreThresholds.excellent) return 'excellent';
    if (score >= scoreThresholds.good) return 'good';
    if (score >= scoreThresholds.average) return 'average';
    return 'poor';
}