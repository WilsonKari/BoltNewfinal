import { create } from 'zustand';
import { Language, ApiConfig, Message, Mode, InterviewSession, InterviewQuestion, FinalAnalysis } from './types';
import { Difficulty } from './difficulties';
import { Career } from './careers';

interface AppState {
  language: Language;
  mode: Mode;
  apiConfig: ApiConfig;
  messages: Message[];
  currentSession: InterviewSession | null;
  sessionHistory: InterviewSession[];
  isInterviewComplete: boolean;
  currentView: 'setup' | 'interview' | 'summary';
  setLanguage: (lang: Language) => void;
  setMode: (mode: Mode) => void;
  setApiConfig: (config: Partial<ApiConfig>) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  startNewSession: (career: Career, difficulty: Difficulty) => void;
  updateCurrentQuestion: (questionData: Partial<InterviewQuestion>) => void;
  completeCurrentSession: (finalAnalysis: FinalAnalysis) => void;
  addNewQuestion: (questionData: Partial<InterviewQuestion>) => void;
  resetInterview: () => void;
  setCurrentView: (view: 'setup' | 'interview' | 'summary') => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set, get) => ({
  error: null,
    setError: (error) => set({ error }),
  language: (localStorage.getItem('language') as Language) || 'en',
  mode: 'interview',
  apiConfig: {
    provider: 'openai',
    baseUrl: '',
    apiKey: '',
    modelId: '',
    elevenLabsKey: '',
  },
  messages: [],
  currentSession: null,
  sessionHistory: [],
  isInterviewComplete: false,
  currentView: 'setup',

  setLanguage: (lang) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },

  setMode: (mode) => set({ mode }),

  setApiConfig: (config) => {
    const newConfig = { ...get().apiConfig, ...config };
    localStorage.setItem('apiConfig', JSON.stringify(newConfig)); // Guardar en localStorage
    set({ apiConfig: newConfig });
  },

  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),

  clearMessages: () => set({ messages: [] }),

  startNewSession: (career, difficulty) => {
    const newSession: InterviewSession = {
      id: Date.now().toString(),
      career,
      difficulty,
      currentQuestionIndex: 0,
      questions: [],
      startTime: Date.now(),
      finalAnalysis: null,
    };
    set({ 
      currentSession: newSession,
      isInterviewComplete: false,
      currentView: 'interview'
    });
  },

  updateCurrentQuestion: (questionData) => set((state) => {
    if (!state.currentSession) return state;

    const currentQuestions = [...state.currentSession.questions];
    const currentIndex = state.currentSession.currentQuestionIndex;

    if (currentIndex < currentQuestions.length) {
      currentQuestions[currentIndex] = {
        ...currentQuestions[currentIndex],
        ...questionData,
        timestamp: currentQuestions[currentIndex].timestamp
      };
    }

    return {
      currentSession: {
        ...state.currentSession,
        questions: currentQuestions
      }
    };
  }),

  addNewQuestion: (questionData) => set((state) => {
    if (!state.currentSession) return state;

    const newQuestion: InterviewQuestion = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      question: '',
      ...questionData
    };

    return {
      currentSession: {
        ...state.currentSession,
        questions: [...state.currentSession.questions, newQuestion],
        currentQuestionIndex: state.currentSession.questions.length
      }
    };
  }),

  completeCurrentSession: (finalAnalysis: FinalAnalysis) => set((state) => {
    if (!state.currentSession) return state;

    const completedSession = {
      ...state.currentSession,
      endTime: Date.now(),
      finalAnalysis
    };

    return {
      currentSession: completedSession,
      sessionHistory: [...state.sessionHistory, completedSession],
      isInterviewComplete: true,
      currentView: 'summary'
    };
  }),

  setCurrentView: (view) => set({ currentView: view }),

  resetInterview: () => {
    const currentState = get();
    const savedApiConfig = currentState.apiConfig;
    
    set({
      currentSession: null,
      isInterviewComplete: false,
      messages: [],
      currentView: 'setup',
      error: null, // Limpiar mensajes de error
      // Mantener las configuraciones importantes
      apiConfig: savedApiConfig,
      language: currentState.language,
      mode: 'interview'
    });
},
}));

// Selector helpers
export const selectIsLastQuestion = (state: AppState) => {
  if (!state.currentSession) return false;
  return state.currentSession.questions.length >= state.currentSession.difficulty.questionsCount;
};

export const selectCurrentQuestion = (state: AppState) => {
  if (!state.currentSession) return null;
  const { questions, currentQuestionIndex } = state.currentSession;
  return questions[currentQuestionIndex] || null;
};

export const selectSessionProgress = (state: AppState) => {
  if (!state.currentSession) return 0;
  const { questions, difficulty } = state.currentSession;
  return (questions.length / difficulty.questionsCount) * 100;
};

// Inicializar apiConfig desde localStorage si existe
const savedApiConfig = localStorage.getItem('apiConfig');
if (savedApiConfig) {
  useStore.getState().setApiConfig(JSON.parse(savedApiConfig));
}