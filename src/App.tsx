import './App.css';

import Tabs, { Tab } from 'Components/Tabs';
import Messages from 'Components/Messages';
import Sessions from 'Components/Sessions';

function App() {
  const items: Tab[] = [
    { label: 'Messages', Component: Messages },
    { label: 'Sessions', Component: Sessions },
  ];

  return <Tabs items={items} />;
}

export default App;
