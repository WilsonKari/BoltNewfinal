import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../lib/store';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { apiConfig, setApiConfig } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-xl">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
          <h2 className="text-xl font-semibold">{t('common.settings')}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('settings.apiProvider')}
              </label>
              <select
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                value={apiConfig.provider}
                onChange={(e) => setApiConfig({ provider: e.target.value as 'openai' | 'compatible' })}
              >
                <option value="openai">OpenAI</option>
                <option value="compatible">Compatible API</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('settings.baseUrl')}
              </label>
              <input
                type="url"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                value={apiConfig.baseUrl}
                onChange={(e) => setApiConfig({ baseUrl: e.target.value })}
                placeholder="https://api.openai.com/v1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('settings.apiKey')}
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                value={apiConfig.apiKey}
                onChange={(e) => setApiConfig({ apiKey: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('settings.modelId')}
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                value={apiConfig.modelId}
                onChange={(e) => setApiConfig({ modelId: e.target.value })}
                placeholder="gpt-4-turbo-preview"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('settings.elevenLabsKey')}
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-2"
                value={apiConfig.elevenLabsKey}
                onChange={(e) => setApiConfig({ elevenLabsKey: e.target.value })}
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {t('settings.save')}
          </Button>
        </form>
      </div>
    </div>
  );
};