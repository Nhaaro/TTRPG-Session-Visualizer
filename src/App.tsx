import './App.css';

import Tabs, { Tab } from 'Components/Tabs';
import Messages from 'Components/Messages';
import Sessions from 'Components/Sessions';

import React, { useState } from 'react';
import type { Message } from 'Types/Messages';
import { key } from 'Components/Messages/utils';

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

  return (
    <ModuleContext.Provider value={{ selectedModule, setSelectedModule, days, setDays }}>
      <Tabs items={items} />
    </ModuleContext.Provider>
  );
}

export default App;
