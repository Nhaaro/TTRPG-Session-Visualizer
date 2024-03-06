import './App.css';

import Tabs, { Tab } from 'Components/Tabs';
import Messages from 'Components/Messages';
import Sessions from 'Components/Sessions';

import React, { useState } from 'react';
import type { Message } from 'Types/Messages';
import { key } from 'Components/Messages/utils';
import { EventTracker } from './context/EventPathContext';

interface selectedModule {
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
      days: Map<key, Message[]>;
      setDays: React.Dispatch<React.SetStateAction<Map<key, Message[]>>>;
      structures: Set<string>;
      setStructures: React.Dispatch<React.SetStateAction<Set<string>>>;
    }
  | undefined
>(undefined);

function App() {
  const items: Tab[] = [
    { label: 'Messages', Component: Messages },
    { label: 'Sessions', Component: Sessions },
  ];

  const [selectedModule, setSelectedModule] = useState<selectedModule>({
    log: '',
    group: '',
    file: '',
    length: 0,
    module: [],
  });

  const [days, setDays] = useState(new Map<key, Message[]>());
  const [structures, setStructures] = useState(new Set<string>());

  (globalThis as any).moduleContext = {
    selectedModule,
    days,
    structures,
  };

  return (
    <EventTracker>
      <ModuleContext.Provider value={{ selectedModule, setSelectedModule, days, setDays, structures, setStructures }}>
        <Tabs items={items} />
      </ModuleContext.Provider>
    </EventTracker>
  );
}

export default App;
