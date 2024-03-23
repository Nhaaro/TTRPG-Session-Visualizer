import { useContext } from 'react';
import styled from 'styled-components';
import { ModuleContext } from '../../App';

export const MessagesSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { sessions, selectedSession } = messagesContext;

  return (
    <Section>
      <ul>
        {selectedSession.map((timestamp) => {
          const session = Array.from(sessions.keys()).find((session) => session.timestamp === timestamp);
          if (session) {
            const messages = sessions.get(session);
            return (
              <li key={timestamp}>
                <span className="localized-date">
                  {new Date(session.timestamp).toLocaleString('en-US', {
                    weekday: 'short',
                    day: '2-digit',
                    month: 'short',
                  })}
                </span>
                &nbsp;&nbsp;
                <span className="time-range">{`${session.startTime} - ${session.endTime}`}</span>
                <ul>
                  {messages?.map((message, i) => (
                    <li key={i}>{JSON.stringify(message)}</li>
                  ))}
                </ul>
              </li>
            );
          }
        })}
      </ul>
    </Section>
  );
};

const Section = styled.section`
  grid-area: messages;
  overflow: scroll;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    > li li {
      transition: background-color 0.25s, color 0.25s;
      &:hover {
        background-color: #646cff;
      }
      &.active {
        color: #646cff;
        &:hover {
          color: #000;
        }
      }
      &.isPending {
        color: gray;
      }
    }
  }
`;
