import { useContext, useTransition } from 'react';
import styled from 'styled-components';
import type { Message } from 'Types/Messages';
import { jsonModules, paths, prefix, sufix } from '.';
import { ModuleContext } from '../../App';
import classNames from 'classnames';

const ModuleButton: React.FC<{ onClick: () => void; active: boolean; module: string; isPending: boolean }> = ({
  onClick,
  active,
  module,
  isPending,
}) => {
  return (
    <li
      onClick={onClick}
      className={classNames({
        active,
        isPending,
      })}
    >
      <span style={{ paddingLeft: '1rem' }}>{module}</span>
    </li>
  );
};

export const ModulesSection = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const { selectedModule, setSelectedModule } = messagesContext;
  const [isPending, startTransition] = useTransition();

  const loadMessages = (group: string, log: string) => async () => {
    setSelectedModule({ log, group, file: `${group}/${log}`, length: 0, module: [] });

    const modulePath = `${prefix}${group}/${log}${sufix}`;
    const module = (await jsonModules[modulePath]()) as { default: Message[] };

    startTransition(() => {
      setSelectedModule({ log, group, file: `${group}/${log}`, length: module.default.length, module: module.default });
    });
  };

  return (
    <Section>
      <ul className="logs-list">
        {paths.map(([group, modules]) => (
          <li style={{ marginBottom: '1rem' }} key={group}>
            {group && <strong>{group}</strong>}
            <ul>
              {modules.map((module) => (
                <ModuleButton
                  key={module}
                  onClick={loadMessages(group, module)}
                  active={selectedModule.file === `${group}/${module}`}
                  module={module}
                  isPending={isPending}
                />
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
      &.isPending {
        color: gray;
      }
    }
  }
`;
