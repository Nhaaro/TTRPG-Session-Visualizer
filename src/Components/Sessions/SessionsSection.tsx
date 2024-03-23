import { useContext } from 'react';
import styled from 'styled-components';
import { offset } from 'Utils/utils';
import { ModuleContext } from '../../App';

export const SessionsSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { sessions, selectedModule, selectedSession, setSelectedSession } = messagesContext;

  return (
    <Section>
      <h3>
        <strong>{selectedModule.group}</strong>
        <span style={{ fontSize: 'x-small' }}>|</span>
        <span>{selectedModule.log.replaceAll('-', ' ').replace('.messages', ' ')}</span>
        <span style={{ fontSize: '0.75em', alignSelf: 'center', color: 'gray' }}>{selectedModule.length}</span>
      </h3>
      <ul>
        {[...sessions.keys()].map((key) => (
          <Details
            key={key.date}
            open={selectedSession.includes(key.timestamp)}
            onClick={(e) => {
              e.preventDefault();
              setSelectedSession((selected) => {
                if (!e.currentTarget.attributes.getNamedItem('open')) {
                  return [...selected, key.timestamp].sort();
                } else return selected.filter((s) => s !== key.timestamp);
              });
            }}
          >
            <summary>
              <span>{new Date(key.timestamp - offset * 60 * 1000).toISOString().split('T')[0]}</span>
              &nbsp;
              <span className="localized-date">
                {new Date(key.timestamp).toLocaleString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
              &nbsp;&nbsp;
              <span className="time-range">{`${key.startTime} - ${key.endTime}`}</span>
              &nbsp;
              <span>
                (<pre>{sessions.get(key)?.length}</pre>)
              </span>
            </summary>
            <div>
              <pre>
                {Object.entries({ date: key.date, startTime: key.startTime, endTime: key.endTime })
                  .map(([k, v]) => `${k}: ${v}`)
                  .join('\n')}
              </pre>
              <pre>{JSON.stringify({ ...key.sources, [selectedModule.log]: key }, null, 2)}</pre>
            </div>
          </Details>
        ))}
      </ul>
    </Section>
  );
};
const Section = styled.section`
  grid-area: sessions;
  overflow: scroll;
  padding-inline-end: 4px;

  h3 {
    display: flex;
    align-items: center;
    text-transform: uppercase;
    gap: 0.5rem;
  }
  ul {
    padding-inline-start: 0;
  }
`;

const Details = styled.details`
  display: contents;
  &[open] summary span {
    color: gray;
  }
  summary {
    ::marker {
      display: none;
    }
    line-height: 15px;
    * {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
    }

    pre {
      display: inline;
      margin: 0;
    }
    .localized-date {
      color: white;
      font-weight: bold;
    }
    .time-range {
      color: gray;
    }
  }
  div {
    max-width: fit-content;
    padding-left: 10px;
    border-left: 2px solid;
    border-color: gray;
    margin-left: 3px;
    pre {
      margin: 0;
      padding: 1em 0;
      border-style: solid;
      border-width: 1px 0px 0px;
      &:first-child {
        border-top-width: 0px;
      }
    }
  }
`;
