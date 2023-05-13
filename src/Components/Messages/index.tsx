import { useState } from 'react';
import styled from 'styled-components';

import type { Message } from 'Types/Messages';
import { MS, offset, useArrayIterator } from 'Utils/utils';
import { jsonModules, key, paths, prefix, sufix } from './utils';

const Messages = () => {
  const [selected, setSelectedModule] = useState<{
    log: string;
    group: string;
    file: string;
    length: number;
    module: Message[];
  }>({ log: '', group: '', file: '', length: 0, module: [] });

  const loadMessages = (group: string, log: string) => async () => {
    setSelectedModule({ log, group, file: `${group}/${log}`, length: 0, module: [] });

    const modulePath = `${prefix}${group}/${log}${sufix}`;
    const module = (await jsonModules[modulePath]()) as { default: Message[] };

    setSelectedModule({ log, group, file: `${group}/${log}`, length: module.default.length, module: module.default });
  };

  const [days, setDays] = useState(new Map<key, Message[]>());
  useArrayIterator(
    { array: selected.module, deps: [setDays, selected.module] as const },
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
        sources.add(curr.src ?? selected.file);
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
                    className={selected.file === `${group}/${log}` ? 'active' : ''}
                  >
                    <span style={{ paddingLeft: '1rem' }}>{log}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </LogsSection>

      <MessagesSection>
        <h3 style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <strong>{selected.group}</strong>
            {selected.log && ' - '}
            <span>{selected.log.replaceAll('-', ' ').replace('.messages', ' ')}</span>
          </div>
          <div style={{ fontSize: '0.75em', alignSelf: 'center', color: 'gray' }}>
            {(!!selected.length &&
              days.size &&
              `${[...days.keys()][days.size - 1].endIndex}/${selected.length} - ${Math.round(
                ([...days.keys()][days.size - 1].endIndex! / selected.length) * 100
              )}%`) ||
              ''}
          </div>
        </h3>
        <ul>
          {[...days.keys()].map((key, i) => (
            <Details
              key={key.date}
              style={{ display: 'contents' }}
              open={i === days.size - 1 && key.endIndex != selected.length}
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
                <pre>{JSON.stringify({ ...key.sources, [selected.log]: key }, null, 2)}</pre>
              </div>
            </Details>
          ))}
        </ul>
      </MessagesSection>
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
const MessagesSection = styled.section`
  grid-area: messages;
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
