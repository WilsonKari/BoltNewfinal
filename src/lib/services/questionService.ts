import { Career } from '../careers';
import { Difficulty } from '../difficulties';
import { ApiConfig } from '../types';

interface QuestionContext {
    career: Career;
    difficulty: Difficulty;
    previousQuestions: string[];
    currentQuestionIndex: number;
}

export class QuestionService {
    private static usedQuestions = new Set<string>();

    static clearUsedQuestions() {
        this.usedQuestions.clear();
    }

    private static async generatePrompt(context: QuestionContext, language: string): Promise<string> {
        const { career, difficulty, previousQuestions, currentQuestionIndex } = context;
        const careerLabel = language === 'es' ? career.label.es : career.label.en;
        const promptModifier = difficulty.promptModifier[language];
        const totalQuestions = difficulty.questionsCount;

        const basePrompt = language === 'es'
            ? `Actúa como un entrevistador experto para un puesto de ${careerLabel}. 
         ${promptModifier}
         Esta es la pregunta ${currentQuestionIndex + 1} de ${totalQuestions}.
         
         Genera UNA pregunta de entrevista que:
         1. Sea específica para el nivel de experiencia
         2. Evalúe habilidades técnicas y soft skills
         3. Sea diferente a las preguntas anteriores
         4. Requiera una respuesta detallada de al menos ${difficulty.minimumAnswerLength} caracteres
         
         Preguntas anteriores a evitar:
         ${previousQuestions.map(q => `- ${q}`).join('\n')}
         
         Responde SOLO con la pregunta, sin numeración, contexto o explicación adicional.`
            : `Act as an expert interviewer for a ${careerLabel} position. 
         ${promptModifier}
         This is question ${currentQuestionIndex + 1} of ${totalQuestions}.
         
         Generate ONE interview question that:
         1. Is specific to the experience level
         2. Evaluates both technical and soft skills
         3. Is different from previous questions
         4. Requires a detailed answer of at least ${difficulty.minimumAnswerLength} characters
         
         Previous questions to avoid:
         ${previousQuestions.map(q => `- ${q}`).join('\n')}
         
         Respond ONLY with the question, without numbering, context, or additional explanation.`;

        return basePrompt;
    }

    static async generateQuestion(
        career: Career,
        difficulty: Difficulty,
        config: ApiConfig,
        language: string,
        previousQuestions: string[] = []
    ): Promise<string> {
        const context: QuestionContext = {
            career,
            difficulty,
            previousQuestions,
            currentQuestionIndex: previousQuestions.length
        };

        const prompt = await this.generatePrompt(context, language);

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
                        content: 'You are an expert technical interviewer. Provide only the question without any additional text.'
                    },
                    {
                        role: 'user',
                        content: prompt,
                    },
                ],
                temperature: 0.8,
            }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        const question = data.choices[0].message.content.trim();

        // Verificar si la pregunta ya se ha usado
        if (this.usedQuestions.has(question.toLowerCase())) {
            // Si la pregunta está repetida y aún hay margen para intentar, recursivamente generar otra
            if (this.usedQuestions.size < 100) { // Límite de seguridad
                return this.generateQuestion(career, difficulty, config, language, previousQuestions);
            }
            throw new Error('No se pueden generar más preguntas únicas');
        }

        // Almacenar la pregunta en el conjunto de preguntas usadas
        this.usedQuestions.add(question.toLowerCase());
        return question;
    }

    static validateAnswerLength(answer: string, minLength: number): boolean {
        return answer.trim().length >= minLength;
    }

    static async validateAndAnalyzeAnswer(
        answer: string,
        minLength: number,
        analysisFunction: () => Promise<any>,
        language: string
    ) {
        if (!this.validateAnswerLength(answer, minLength)) {
            throw new Error(
                language === 'es'
                    ? `La respuesta debe tener al menos ${minLength} caracteres`
                    : `Answer must be at least ${minLength} characters long`
            );
        }

        return analysisFunction();
    }
}