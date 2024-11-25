import { Career } from './careers';
import { Difficulty } from './difficulties';

export type Language = 'en' | 'es';

export interface ApiConfig {
  provider: 'openai' | 'compatible';
  baseUrl: string;
  apiKey: string;
  modelId: string;
  elevenLabsKey: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  answer?: string;
  analysis?: AnswerAnalysis;
  timestamp: number;
}

export interface InterviewSession {
  id: string;
  career: Career;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  startTime: number;
  endTime?: number;
  finalAnalysis?: FinalAnalysis;
}

export interface AnswerAnalysis {
  score: number;
  strengths: string[];
  improvements: string[];
  overallFeedback: string;
}

export interface FinalAnalysis {
  averageScore: number;
  totalQuestions: number;
  completedQuestions: number;
  strongAreas: string[];
  improvementAreas: string[];
  overallFeedback: string;
  scoreCategory: 'poor' | 'average' | 'good' | 'excellent';
}

export type Mode = 'interview' | 'chat';