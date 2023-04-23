import { useState } from 'react';
import styled from 'styled-components';

import { paths } from './utils';

const Messages = () => {
  const [[selectedModule, selectedGroup, selectedFile], setSelectedModule] = useState<[string, string, string]>([
    '',
    '',
    '',
  ]);

  const loadMessages = (group: string, log: string) => async () => {
    setSelectedModule([log, group, `${group}/${log}`]);
  };

  return (
    <Grid>
      <LogsSection>
        <ul className="logs-list">
          {paths.map(([group, logs]) => (
            <li style={{ marginBottom: '1rem' }} key={group}>
              {group && <strong>{group}</strong>}
              <ul>
                {logs.map((log) => (
                  <li
                    key={log}
                    onClick={loadMessages(group, log)}
                    className={selectedFile === `${group}/${log}` ? 'active' : ''}
                  >
                    <span style={{ paddingLeft: '1rem' }}>{log}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </LogsSection>
    </Grid>
  );
};

export default Messages;

const Grid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content max-content;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 20px;
  grid-auto-flow: row;
  grid-template-areas:
    'logs messages templates objects'
    'logs messages templates objects';
  flex: 1;
  overflow-y: hidden;
`;
const LogsSection = styled.section`
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
