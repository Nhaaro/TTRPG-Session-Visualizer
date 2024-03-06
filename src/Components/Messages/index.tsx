import { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { ModuleContext } from '../../App';
import type { Message } from 'Types/Messages';
import { MS, offset, useArrayIterator } from 'Utils/utils';
import { jsonModules, key, paths, prefix, getStructure, sufix } from './utils';
import UniqueStructures from './UniqueStructures';
import { EventPathContext } from '../..//context/EventPathContext';

const structuresMap = ((globalThis as any).structuresMap = new Map<string, Set<unknown>>());

const Messages = () => {
  const messagesContext = useContext(ModuleContext);
  if (!messagesContext) {
    throw new Error('Unable to read messagesContext');
  }
  const eventTrackerContext = useContext(EventPathContext);
  if (!eventTrackerContext) {
    throw new Error('ChildComponent must be used within an EventTracker');
  }
  const { pathIdentifier } = eventTrackerContext;

  const { selectedModule, setSelectedModule } = messagesContext;
  const loadMessages = (group: string, log: string) => async () => {
    setSelectedModule({ log, group, file: `${group}/${log}`, length: 0, module: [] });

    const modulePath = `${prefix}${group}/${log}${sufix}`;
    const module = (await jsonModules[modulePath]()) as { default: Message[] };

    setSelectedModule({ log, group, file: `${group}/${log}`, length: module.default.length, module: module.default });
  };

  const { days, setDays } = messagesContext;
  useArrayIterator(
    { array: selectedModule.module, deps: [setDays, selectedModule.module] as const },
    (index, curr, [setDays]) => {
      const difference = 0;
      const ms = MS.day;

      setDays((groups) => {
        const timestamp = difference ? curr.timestamp : Math.round(curr.timestamp / ms) * ms;
        let offsetedDate: Date;

        const keys = [...groups.keys()];
        const keyIndex = keys.findIndex((key) => key.timestamp === timestamp);
        let key: key;
        let diff;
        if (difference && keys.length > 0) {
          const tmp = keys[keyIndex === -1 ? keys.length - 1 : keyIndex];
          const tmp2 = keys[keyIndex - 1] || tmp;
          diff = curr.timestamp - tmp.endTimestamp!;
          if (diff < difference) key = tmp2;
        }
        key ||= keys.find((key) => key.timestamp === timestamp) || {
          timestamp,
          diff,
          sources: {},
        };

        offsetedDate = new Date(key.timestamp - offset * 60 * 1000);
        key.date = offsetedDate.toISOString().split('T')[0];

        offsetedDate = new Date(difference ? curr.timestamp : Math.floor(curr.timestamp / MS(5)) * MS(5));
        key.startTime =
          key.startTime ||
          offsetedDate.toLocaleString('en-UK', {
            hour: '2-digit',
            minute: '2-digit',
          });
        offsetedDate = new Date(difference ? curr.timestamp : Math.ceil(curr.timestamp / MS(5)) * MS(5));
        key.endTime = offsetedDate.toLocaleString('en-UK', {
          hour: '2-digit',
          minute: '2-digit',
        });

        const sources = new Set<string>();
        sources.add(curr.src ?? selectedModule.file);
        for (const src of sources) {
          if (src === curr.src) {
            const json = (key.sources[src] = key.sources[src] ?? {});

            json.startIndex = json.startIndex ?? curr.index; // keep index 0
            json.endIndex = curr.index + 1; // jq's endIndex is exclusive
            json.startTimestamp = json.startTimestamp || curr.timestamp;
            json.endTimestamp = curr.timestamp;
          }
          key.startIndex = key.startIndex ?? index; // keep index 0
          key.endIndex = index + 1; // jq's endIndex is exclusive
          key.startTimestamp = key.startTimestamp || curr.timestamp;
          key.endTimestamp = curr.timestamp;
        }

        const acc = groups.get(key) || [];
        const map = new Map(groups.set(key, [...acc, curr]));
        return map;
      });
    },
    () => setDays(new Map())
  );

  const { structures, setStructures } = messagesContext;
  useArrayIterator(
    { array: selectedModule.module, deps: [setStructures, selectedModule.module] as const },
    (index, value, [setStructures]) => {
      if ('$$deleted' in value) return;

      setStructures((structures) => {
        const objectStructure = getStructure(
          { key: '', value, parent: { location: '' }, structuresMap },
          !selectedModule.module[index + 1]
        );
        const stringifiedStructure = JSON.stringify(objectStructure.value as string);

        if (!structures.has(stringifiedStructure)) {
          return new Set([...structures, stringifiedStructure]);
        } else {
          return new Set([...structures]);
        }
      });
    },
    () => setStructures(new Set())
  );

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
                    className={selectedModule.file === `${group}/${log}` ? 'active' : ''}
                  >
                    <span style={{ paddingLeft: '1rem' }}>{log}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </LogsSection>

      <SessionsSection>
        <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{selectedModule.group}</strong>
            {selectedModule.log && ' - '}
            <span>{selectedModule.log.replaceAll('-', ' ').replace('.messages', ' ')}</span>
          </div>
          <div style={{ fontSize: '0.75em', alignSelf: 'center', color: 'gray' }}>
            {(!!selectedModule.length &&
              days.size &&
              `${[...days.keys()][days.size - 1].endIndex}/${selectedModule.length} - ${Math.round(
                ([...days.keys()][days.size - 1].endIndex! / selectedModule.length) * 100
              )}%`) ||
              ''}
          </div>
        </h3>
        <ul>
          {[...days.keys()].map((key, i) => (
            <Details
              key={key.date}
              style={{ display: 'contents' }}
              open={i === days.size - 1 && key.endIndex != selectedModule.length}
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
      </SessionsSection>

      <StructuresSection>
        <ul>
          {[...structures.values()].map((obj, i) => (
            <li key={i}>
              <UniqueStructures src={JSON.parse(obj)} />
            </li>
          ))}
        </ul>
      </StructuresSection>

      <ValuesSection>
        <h3>{pathIdentifier}</h3>
        <ul>
          {[...(structuresMap.get(pathIdentifier)?.values() || [])].map((value, i) => (
            <li key={i} className={Array.isArray(value) ? 'array' : typeof value}>
              {JSON.stringify(value)}
            </li>
          ))}
        </ul>
      </ValuesSection>
    </Grid>
  );
};

export default Messages;

const Grid = styled.div`
  display: grid;
  grid-template-columns: max-content max-content max-content max-content max-content;
  grid-template-rows: 1fr;
  grid-gap: 0.5rem 20px;
  grid-auto-flow: row;
  grid-template-areas:
    'logs sessions structures values'
    'logs sessions structures values';
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
const SessionsSection = styled.section`
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

const StructuresSection = styled.section`
  grid-area: structures;
  display: flex;
  flex-direction: column;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    flex: 1;
    overflow: scroll;
    padding-right: 0.8rem;

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

const ValuesSection = styled.section`
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
