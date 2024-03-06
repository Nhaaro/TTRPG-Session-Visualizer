import React, { useEffect, useState } from 'react';

export const EventPathContext = React.createContext<
  | {
      path: string[];
      registerPath: (elementName: string) => void;
      setPropagationFinished: () => void;
      pathIdentifier: string;
    }
  | undefined
>(undefined);

// EventTracker component to provide the context
export const EventTracker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [path, setPath] = useState<string[]>([]);
  const [propagationFinished, setPropagationFinished] = useState<boolean>(false);
  const [pathIdentifier, setPathIdentifier] = useState('');

  const registerPath = (elementName: string) => {
    setPath((prevPath) => [...prevPath, elementName]);
    setPropagationFinished(false); // Reset on each registration
  };

  const handlePropagationFinished = () => {
    setPropagationFinished(true);
  };

  useEffect(() => {
    if (propagationFinished && path.length) {
      setPathIdentifier(path.reverse().join('.'));
      // Reset path for the next event
      setPath([]);
    }
  }, [propagationFinished, path]);

  return (
    <EventPathContext.Provider
      value={{ path, registerPath, setPropagationFinished: handlePropagationFinished, pathIdentifier }}
    >
      {children}
    </EventPathContext.Provider>
  );
};
