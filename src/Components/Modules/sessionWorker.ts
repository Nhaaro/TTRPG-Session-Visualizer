import { Message } from 'Types/Messages';
import { MS, offset } from 'Utils/utils';
import { SessionMetadata } from '.';
import { selectedModule } from '../../App';

const worker: Worker = self as never;
worker.onmessage = (event: MessageEvent<selectedModule>) => {
  const selectedModule = event.data;
  const groups = new Map<SessionMetadata, Message[]>();

  for (const [index, curr] of selectedModule.module.entries()) {
    const difference = 0;
    const ms = MS.day;

    if ('$$deleted' in curr) return;

    const timestamp = difference ? curr.timestamp : Math.round(curr.timestamp / ms) * ms;
    let offsetedDate: Date;

    const keys = [...groups.keys()];
    let key: SessionMetadata;
    const keyIndex = keys.findIndex((key) => key.timestamp === timestamp);
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
    groups.set(key, [...acc, curr]);
    worker.postMessage(groups);
  }
};

export {}; // Make TypeScript treat this file as a module
