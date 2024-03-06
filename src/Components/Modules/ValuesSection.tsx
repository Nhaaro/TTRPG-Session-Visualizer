import { useContext } from 'react';
import styled from 'styled-components';
import { EventPathContext } from '../../context/EventPathContext';

const structuresMap = (globalThis as any).structuresMap;

export const ValuesSection = () => {
  const eventTrackerContext = useContext(EventPathContext);
  if (!eventTrackerContext) {
    throw new Error('ChildComponent must be used within an EventTracker');
  }
  const { pathIdentifier } = eventTrackerContext;

  return (
    <Section>
      <h3>{pathIdentifier}</h3>
      <ul>
        {[...(structuresMap.get(pathIdentifier)?.values() || [])].map((value, i) => (
          <li key={i} className={Array.isArray(value) ? 'array' : typeof value}>
            {JSON.stringify(value)}
          </li>
        ))}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  grid-area: values;
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow: scroll;
    padding-right: 0.8rem;
  }
`;
