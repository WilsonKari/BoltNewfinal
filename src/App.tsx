import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TabSwitch } from './components/layout/TabSwitch';
import { ChatInterface } from './components/chat/ChatInterface';
import { InterviewInterface } from './components/interview/InterviewInterface';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { useStore } from './lib/store';
import './lib/i18n';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const mode = useStore((state) => state.mode);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-sm">
          <TabSwitch />
          {mode === 'chat' && <ChatInterface />}
          {mode === 'interview' && <InterviewInterface />}
        </div>
      </main>
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
};

export default App;