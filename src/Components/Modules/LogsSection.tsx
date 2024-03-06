import { useContext } from 'react';
import styled from 'styled-components';
import type { Message } from 'Types/Messages';
import { jsonModules, paths, prefix, sufix } from '.';
import { ModuleContext } from '../../App';

export const LogsSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { selectedModule, setSelectedModule } = messagesContext;

  const loadMessages = (group: string, log: string) => async () => {
    setSelectedModule({ log, group, file: `${group}/${log}`, length: 0, module: [] });

    const modulePath = `${prefix}${group}/${log}${sufix}`;
    const module = (await jsonModules[modulePath]()) as { default: Message[] };

    setSelectedModule({ log, group, file: `${group}/${log}`, length: module.default.length, module: module.default });
  };

  return (
    <Section>
      <ul className="logs-list">
        {paths.map(([group, logs]) => (
          <li style={{ marginBottom: '1rem' }} key={group}>
            {group && <strong>{group}</strong>}
            <ul>
              {logs.map((log) => (
                <li
                  key={log}
                  onClick={loadMessages(group, log)}
                  className={selectedModule.file === `${group}/${log}` ? 'active' : ''}
                >
                  <span style={{ paddingLeft: '1rem' }}>{log}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
};
const Section = styled.section`
  grid-area: logs;

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
    }
  }
`;
