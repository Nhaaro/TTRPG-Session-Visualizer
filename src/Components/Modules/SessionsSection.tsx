import { useContext, useEffect } from 'react';
import styled from 'styled-components';
import { Message } from 'Types/Messages';
import { offset } from 'Utils/utils';
import type { SessionMetadata } from '.';
import { ModuleContext } from '../../App';

export const SessionsSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { selectedModule } = messagesContext;

  const { sessions, setSessions } = messagesContext;

  useEffect(() => {
    const worker = new Worker(new URL('./sessionWorker.ts', import.meta.url), { type: 'module' });

    if (
      !sessions.size ||
      JSON.stringify(sessions.values().next().value[0]) !== JSON.stringify(selectedModule.module[0])
    )
      worker.postMessage(selectedModule);

    worker.onmessage = (e: MessageEvent<Map<SessionMetadata, Message[]>>) => {
      setSessions(e.data);
    };

    return () => worker.terminate();
  }, [selectedModule.file]);

  return (
    <Section>
      <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <strong>{selectedModule.group}</strong>
          {selectedModule.log && ' - '}
          <span>{selectedModule.log.replaceAll('-', ' ').replace('.messages', ' ')}</span>
        </div>
        <div style={{ fontSize: '0.75em', alignSelf: 'center', color: 'gray' }}>
          {(!!selectedModule.length &&
            sessions.size &&
            `${[...sessions.keys()][sessions.size - 1].endIndex}/${selectedModule.length} - ${Math.round(
              ([...sessions.keys()][sessions.size - 1].endIndex! / selectedModule.length) * 100
            )}%`) ||
            ''}
        </div>
      </h3>
      <ul>
        {[...sessions.keys()].map((key, i) => (
          <Details
            key={key.date}
            style={{ display: 'contents' }}
            open={i === sessions.size - 1 && key.endIndex != selectedModule.length}
          >
            <summary>
              <span style={{ color: 'gray', fontStyle: 'italic' }}>{key.timestamp.toString().slice(0, 8)}</span>
              &nbsp;
              <span>{new Date(key.timestamp - offset * 60 * 1000).toISOString().split('T')[0]}</span>
              &nbsp;
              <span style={{ color: 'white', fontWeight: 'bold' }}>
                {new Date(key.timestamp).toLocaleString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
              &nbsp;&nbsp;
              <span style={{ color: 'gray' }}>{`${key.startTime} - ${key.endTime}`}</span>
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
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow: scroll;

    li {
      &:hover {
        background-color: rgba(255, 255, 255, 0.04);
      }
      &.active {
        background-color: rgba(255, 255, 255, 0.08);
      }
    }
  }
`;
const Details = styled.details`
  summary {
    ::marker {
      display: none;
    }
    line-height: 15px;
    * {
      font-family: 'Roboto Mono', monospace;
      font-size: 12px;
    }
  }
  div {
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
