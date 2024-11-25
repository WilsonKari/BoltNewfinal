import React from 'react';
import { useTranslation } from 'react-i18next';
import { careers, Career } from '../../lib/careers';

interface CareerSelectProps {
  value: Career | null;
  onChange: (career: Career | null) => void;
  disabled?: boolean;
}

export const CareerSelect: React.FC<CareerSelectProps> = ({
  value,
  onChange,
  disabled
}) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as 'en' | 'es';

  // Group careers by category
  const groupedCareers = careers.reduce((acc, career) => {
    const category = career.category[currentLang];
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(career);
    return acc;
  }, {} as Record<string, Career[]>);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">
        {t('interview.selectCareer')}
      </label>
      <select
        className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
        value={value?.id || ''}
        onChange={(e) => {
          const career = careers.find(c => c.id === e.target.value) || null;
          onChange(career);
        }}
        disabled={disabled}
      >
        <option value="">{t('interview.chooseCareers')}</option>
        {Object.entries(groupedCareers).map(([category, categoryCareers]) => (
          <optgroup key={category} label={category}>
            {categoryCareers.map((career) => (
              <option key={career.id} value={career.id}>
                {career.label[currentLang]}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};