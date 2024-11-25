import { ApiConfig, AnswerAnalysis, FinalAnalysis, InterviewSession } from './types';
import { Career } from './careers';
import { Difficulty } from './difficulties';
import { QuestionService } from './services/questionService';
import { AnalysisService } from './services/analysisService';

export async function sendChatMessage(
  message: string,
  config: ApiConfig,
  language: string
) {
  try {
    const systemMessage =
      language === 'es'
        ? 'Eres un asistente útil. Responde siempre en español.'
        : 'You are a helpful assistant. Always respond in English.';

    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.modelId,
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling AI API:', error);
    throw error;
  }
}

export async function getNextQuestion(
  career: Career,
  difficulty: Difficulty,
  config: ApiConfig,
  language: string,
  previousQuestions: string[] = []
): Promise<string> {
  try {
    const question = await QuestionService.generateQuestion(
      career,
      difficulty,
      config,
      language,
      previousQuestions
    );
    return question;
  } catch (error) {
    console.error('Error getting interview question:', error);
    throw error;
  }
}

export async function synthesizeSpeech(
  text: string,
  apiKey: string,
  language: string
) {
  try {
    const voiceId =
      language === 'es'
        ? 'EXAVITQu4vr4xnSDxMaL' // ID de voz en español (Nicole)
        : 'CwhRBWXzGAHq8TQ4Fs17'; // ID de voz en inglés (Rachel)

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    return await response.blob();
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    throw error;
  }
}

export async function analyzeAnswer(
  question: string,
  answer: string,
  career: Career,
  difficulty: Difficulty,
  config: ApiConfig,
  language: string
): Promise<AnswerAnalysis> {
  try {
    return await QuestionService.validateAndAnalyzeAnswer(
      answer,
      difficulty.minimumAnswerLength,
      async () => {
        if (!config.baseUrl || !config.apiKey || !config.modelId) {
          throw new Error('Missing API configuration');
        }

        const prompt = language === 'es'
          ? `Como entrevistador experto y coach de carrera, evalúa la siguiente respuesta:

Posición: ${career.label.es}
Nivel: ${difficulty.label.es}
Pregunta: ${question}
Respuesta: ${answer}

Proporciona una evaluación con el siguiente formato JSON, sin markdown ni backticks:
{
  "score": (número del 0-100, considera el nivel de dificultad ${difficulty.label.es}),
  "strengths": ["fortaleza 1", "fortaleza 2"],
  "improvements": ["mejora 1", "mejora 2"],
  "overallFeedback": "retroalimentación general"
}

Importante: Responde SOLO con el JSON, sin texto adicional, sin \`\`\`json ni otros formatos.`
          : `As an expert interviewer and career coach, evaluate the following response:

Position: ${career.label.en}
Level: ${difficulty.label.en}
Question: ${question}
Answer: ${answer}

Provide an evaluation in the following JSON format, without markdown or backticks:
{
  "score": (number from 0-100, consider the difficulty level ${difficulty.label.en}),
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "overallFeedback": "overall feedback"
}

Important: Respond ONLY with the JSON, no additional text, no \`\`\`json or other formatting.`;

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
                content: 'You are an AI assistant that responds only with clean JSON, no markdown formatting or explanation text.'
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
          const errorData = await response.json();
          throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();

        try {
          // Limpiar la respuesta de markdown
          let contentToParse = data.choices[0].message.content;

          // Remover los backticks y la palabra "json" si están presentes
          contentToParse = contentToParse.replace(/```json\s*/, '').replace(/```\s*$/, '');
          contentToParse = contentToParse.trim();

          // Intentar parsear la respuesta limpia
          const parsedResponse = JSON.parse(contentToParse);

          // Validar la estructura de la respuesta
          if (typeof parsedResponse.score !== 'number' ||
            !Array.isArray(parsedResponse.strengths) ||
            !Array.isArray(parsedResponse.improvements) ||
            typeof parsedResponse.overallFeedback !== 'string') {
            throw new Error('Invalid response format');
          }

          // Ajustar la puntuación según el nivel de dificultad
          parsedResponse.score = Math.max(0, Math.min(100, parsedResponse.score));

          return parsedResponse;
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError);
          console.error('Raw response:', data.choices[0].message.content);
          throw new Error('Failed to parse AI response');
        }
      },
      language
    );
  } catch (error) {
    console.error('Error analyzing answer:', error);
    throw error;
  }
}

export async function generateFinalAnalysis(
  session: InterviewSession,
  config: ApiConfig,
  language: string
): Promise<FinalAnalysis> {
  try {
    return await AnalysisService.generateFinalAnalysis(
      session,
      config,
      language
    );
  } catch (error) {
    console.error('Error generating final analysis:', error);
    throw error;
  }
}