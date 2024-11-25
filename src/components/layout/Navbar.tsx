import React from 'react';
import { useTranslation } from 'react-i18next';
import { Settings, Languages } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../lib/store';

interface NavbarProps {
  onSettingsClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSettingsClick }) => {
  const { t, i18n } = useTranslation();
  const setLanguage = useStore((state) => state.setLanguage);
  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              HirePrepAI
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="text-gray-600 dark:text-gray-300"
            >
              <Languages className="h-5 w-5" />
              <span className="ml-2">{currentLanguage.toUpperCase()}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="text-gray-600 dark:text-gray-300"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};