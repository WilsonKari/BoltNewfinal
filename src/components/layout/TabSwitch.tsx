import React from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Video } from 'lucide-react';
import { Button } from '../ui/Button';
import { useStore } from '../../lib/store';
import { Mode } from '../../lib/types';

export const TabSwitch: React.FC = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useStore();

  return (
    <div className="flex gap-2 p-4 border-b dark:border-gray-800">
      <Button
        variant={mode === 'interview' ? 'primary' : 'ghost'}
        onClick={() => setMode('interview')}
        className="flex-1"
      >
        <Video className="h-5 w-5 mr-2" />
        {t('common.interview')}
      </Button>
      <Button
        variant={mode === 'chat' ? 'primary' : 'ghost'}
        onClick={() => setMode('chat')}
        className="flex-1"
      >
        <MessageSquare className="h-5 w-5 mr-2" />
        {t('common.chat')}
      </Button>
    </div>
  );
};