import React from 'react';
import { useTranslation } from 'react-i18next';
import { difficulties, Difficulty } from '../../lib/difficulties';
import { Badge } from '../ui/Badge';
import { Info } from 'lucide-react';

interface DifficultySelectProps {
    value: Difficulty | null;
    onChange: (difficulty: Difficulty | null) => void;
    disabled?: boolean;
}

export const DifficultySelect: React.FC<DifficultySelectProps> = ({
    value,
    onChange,
    disabled
}) => {
    const { t, i18n } = useTranslation();
    const currentLang = i18n.language as 'en' | 'es';

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium">
                    {t('interview.selectDifficulty')}
                </label>
                <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                    value={value?.id || ''}
                    onChange={(e) => {
                        const difficulty = difficulties.find(d => d.id === e.target.value) || null;
                        onChange(difficulty);
                    }}
                    disabled={disabled}
                >
                    <option value="">{t('interview.chooseDifficulty')}</option>
                    {difficulties.map((difficulty) => (
                        <option key={difficulty.id} value={difficulty.id}>
                            {difficulty.label[currentLang]}
                        </option>
                    ))}
                </select>
            </div>

            {/* Información de la dificultad seleccionada */}
            {value && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-blue-500" />
                        <h4 className="font-medium">{t('interview.difficultyDetails')}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('interview.questions')}:
                            </span>
                            <Badge variant="secondary" className="ml-2">
                                {value.questionsCount}
                            </Badge>
                        </div>

                        <div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('interview.timePerQuestion')}:
                            </span>
                            <Badge variant="secondary" className="ml-2">
                                {value.timePerQuestion} min
                            </Badge>
                        </div>

                        <div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('interview.minAnswerLength')}:
                            </span>
                            <Badge variant="secondary" className="ml-2">
                                {value.minimumAnswerLength}
                            </Badge>
                        </div>

                        <div>
                            <span className="text-gray-600 dark:text-gray-400">
                                {t('interview.difficulty')}:
                            </span>
                            <Badge
                                variant={
                                    value.id === 'beginner' ? 'success' :
                                        value.id === 'intermediate' ? 'warning' :
                                            'error'
                                }
                                className="ml-2"
                            >
                                {value.label[currentLang]}
                            </Badge>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};