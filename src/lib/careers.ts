export interface Career {
  id: string;
  label: {
    en: string;
    es: string;
  };
  category: {
    en: string;
    es: string;
  };
}

export const careers: Career[] = [
  // Technology
  {
    id: 'software-engineer',
    label: { en: 'Software Engineer', es: 'Ingeniero de Software' },
    category: { en: 'Technology', es: 'Tecnología' }
  },
  {
    id: 'data-scientist',
    label: { en: 'Data Scientist', es: 'Científico de Datos' },
    category: { en: 'Technology', es: 'Tecnología' }
  },
  // Healthcare
  {
    id: 'doctor',
    label: { en: 'Medical Doctor', es: 'Médico' },
    category: { en: 'Healthcare', es: 'Salud' }
  },
  {
    id: 'nurse',
    label: { en: 'Nurse', es: 'Enfermero/a' },
    category: { en: 'Healthcare', es: 'Salud' }
  },
  // Business
  {
    id: 'marketing-manager',
    label: { en: 'Marketing Manager', es: 'Gerente de Marketing' },
    category: { en: 'Business', es: 'Negocios' }
  },
  {
    id: 'financial-analyst',
    label: { en: 'Financial Analyst', es: 'Analista Financiero' },
    category: { en: 'Business', es: 'Negocios' }
  },
  // Education
  {
    id: 'teacher',
    label: { en: 'Teacher', es: 'Profesor' },
    category: { en: 'Education', es: 'Educación' }
  },
  {
    id: 'professor',
    label: { en: 'Professor', es: 'Profesor Universitario' },
    category: { en: 'Education', es: 'Educación' }
  },
  // Trades
  {
    id: 'electrician',
    label: { en: 'Electrician', es: 'Electricista' },
    category: { en: 'Trades', es: 'Oficios' }
  },
  {
    id: 'plumber',
    label: { en: 'Plumber', es: 'Plomero' },
    category: { en: 'Trades', es: 'Oficios' }
  }
];