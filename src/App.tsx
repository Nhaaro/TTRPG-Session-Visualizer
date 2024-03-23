import './App.css';

import Tabs, { Tab } from 'Components/Tabs';
import Modules from 'Components/Modules';
import Sessions from 'Components/Sessions';

import React, { useState } from 'react';
import type { Message } from 'Types/Messages';
import { SessionMetadata } from 'Components/Modules/utils';
import { EventTracker } from './context/EventPathContext';
import { useLocalStorage } from 'usehooks-ts';

export interface selectedModule {
  log: string;
  group: string;
  file: string;
  length: number;
  module: Message[];
}

export const ModuleContext = React.createContext<
  | {
      selectedModule: selectedModule;
      setSelectedModule: React.Dispatch<React.SetStateAction<selectedModule>>;
      sessions: Map<SessionMetadata, Message[]>;
      setSessions: React.Dispatch<React.SetStateAction<Map<SessionMetadata, Message[]>>>;
      structures: Set<string>;
      setStructures: React.Dispatch<React.SetStateAction<Set<string>>>;
      selectedSession: number[];
      setSelectedSession: React.Dispatch<React.SetStateAction<number[]>>;
    }
  | undefined
>(undefined);

function App() {
  const items: Tab[] = [
    { label: 'Modules', Component: Modules },
    { label: 'Sessions', Component: Sessions },
  ];

  const [selectedModule, setSelectedModule] = useLocalStorage<selectedModule>('selectedModule', {
    log: '',
    group: '',
    file: '',
    length: 0,
    module: [],
  });

  const [sessions, setSessions] = useState(new Map<SessionMetadata, Message[]>());
  const [structures, setStructures] = useState(new Set<string>());
  const [selectedSession, setSelectedSession] = useLocalStorage<number[]>('selectedSession', []);

  (globalThis as any).moduleContext = {
    selectedModule,
    sessions,
    structures,
  };

  return (
    <EventTracker>
      <ModuleContext.Provider
        value={{
          selectedModule,
          setSelectedModule,
          sessions,
          setSessions,
          structures,
          setStructures,
          selectedSession,
          setSelectedSession,
        }}
      >
        <Tabs items={items} />
      </ModuleContext.Provider>
    </EventTracker>
  );
}

export default App;
