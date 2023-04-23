import { Message } from 'Types/Messages';

const glob = '../../../data/messages/**/*.json';
export const [, prefix, sufix] = /(.*)\*\*\/\*(\.json)/.exec(glob)!;
export const jsonModules = import.meta.glob('../../../data/messages/**/*.json');
export const paths = Object.keys(jsonModules).reduce((paths, modulePath) => {
  const log = /messages\/(.*).json/.exec(modulePath)![1];
  const split = log.split('/') as [string, string] | [string];
  if (split.length === 2) {
    const key = paths.find((log) => log[0] === split[0]);
    if (key) key[1].push(split[1]);
    else paths.push([split[0], [split[1]]]);
  } else {
    const key = paths.find((log) => log[0] === '');
    if (key) key[1].push(split[0]);
    else paths.push(['', split]);
  }
  return paths.sort(([a], [b]) => {
    if (a === '' && b !== '') {
      return -1;
    }
    if (a !== '' && b === '') {
      return 1;
    }
    return 0;
  });
}, [] as [string, string[]][]);

export type key = {
  timestamp: number;
  diff?: number;
  sources: Record<string, Message>;

  date?: string;
  startTimestamp?: number;
  endTimestamp?: number;
  startTime?: string;
  endTime?: string;
  startIndex?: number;
  endIndex?: number;
};
