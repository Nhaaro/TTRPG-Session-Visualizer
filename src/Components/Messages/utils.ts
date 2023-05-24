import { Message } from 'Types/Messages';
import { isValidHtml, isValidJSON } from 'Utils/utils';

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

interface Parent {
  location: string;
  parent?: Parent;
}

const done: Record<string, Set<string>> = {};
const toDo: Record<string, Set<unknown>> = {};
const toVerify: Record<string, Set<unknown>> = {};

const replacements = {
  degreeOfSuccess: '(criticalSuccess|criticalFailure|success|failure)',
  physicalDamage: '(slashing|bludgeoning|piercing)',
  energyDamage: '(acid|fire|negative|positive)',
};

function fill({ location, ...parent }: Parent, valueType: string) {
  let type = [...done[location].values()].map((v) => (isValidJSON(v) ? JSON.parse(v) : v));
  if (type.length === 1 && ![''].includes(location)) {
    if (![''].includes(location)) {
      console.info(`${valueType}::filling::singleType<<${location}>>`, type[0], parent);
      toVerify[location] ??= new Set();
    }
    type = type[0];
  }
  if ([''].includes(location)) console.log(`${valueType}::filling<<${location}>>`, type, parent);
  return type;
}

function assert(assert: string[], valueType: string, { location, ...parent }: Parent, ...value: unknown[]) {
  let key = location;
  for (const replacement in replacements) {
    key = key.replace(new RegExp(`${replacements[replacement as keyof typeof replacements]}`), `{${replacement}}`);
  }

  console.assert(
    assert.some((regex) =>
      new RegExp(
        `^${regex.replace(/\./g, '\\.').replace(/\{\w+\}/g, (match) => {
          const replacement = replacements[match.slice(1, -1) as keyof typeof replacements]; // remove curly braces around match
          return replacement !== undefined ? replacement : match;
        })}$`
      ).test(location)
    ),
    `${valueType}<<${key}>>`,
    parent,
    ...value
  );
}

export type JSONValue = string | number | boolean | null | { [key: string]: JSONValue } | JSONValue[];
export type ObjectStructure = { [key: string]: JSONValue };
export type ArrayStructure = JSONValue[];

export function getStructure(
  curr: { key: string; value: JSONValue; parent: Parent },
  last?: boolean
): { key: string; value: string | string[] | ObjectStructure | false } {
  const { parent } = curr;
  const { location } = parent;

  let type;
  if (['flags', '_id'].includes(location)) return { key: curr.key, value: false };

  if (typeof curr.value === 'boolean') {
    type = typeof curr.value;
  } else if (curr.value === null) {
    switch (true) {
      case Object.keys(done).includes(location):
        type = fill(parent, 'null');
        break;
      default:
        if ([''].includes(location)) console.warn(`null::empty<<${location}>>`, curr.value, parent);
        toDo[location] ??= new Set();
        break;
    }
  } else if (typeof curr.value === 'number') {
    switch (true) {
      case location === 'timestamp':
        type = 'time|unix';
        break;
      default:
        assert([''], 'number', parent, curr.value);
        type = Number.parseInt('' + curr.value) === Number.parseFloat('' + curr.value) ? 'int' : 'float';
        break;
    }
  } else if (typeof curr.value === 'string') {
    switch (true) {
      case curr.value === '':
        switch (true) {
          case Object.keys(done).includes(location):
            type = fill(parent, 'string');
            break;
          default:
            if ([''].includes(location)) console.warn(`string::empty<<${location}>>`, curr.value, parent);
            toDo[location] ??= new Set();
            break;
        }
        break;
      case /([a-f\d]{8}(-[a-f\d]{4}){3}-[a-f\d]{12}?)/i.test(curr.value):
        type = 'UUID';
        break;
      case /^-?\d+(\.\d+)?$/.test(curr.value):
        type = 'string|number';
        break;
      case ['8, 7, 7, 7, 5, 7'].includes(curr.value):
        type = ['string|number'];
        break;
      case ['25 + 9 - 19', '33 - 12 + 9', '33 - 7 + 9', '33 + 9 - 17', '36 - 12 + 9', '36 -  + 9 - 12'].includes(
        curr.value
      ):
        type = ['string|number', 'string|symbol'];
        break;
      case isValidJSON(curr.value):
        type = getStructure({
          key: location,
          value: JSON.parse(curr.value),
          parent: { parent, location: location },
        }).value;
        assert([''], 'string::object', parent, {
          value: curr.value,
          parsed: JSON.parse(curr.value),
          type,
        });
        break;
      case isValidHtml(curr.value):
        type = 'html';
        assert([''], 'string::html', parent, curr.value);
        break;
      case /\.wav/.test(curr.value):
        type = 'file|sound';
        break;
      case /operator$/.test(location):
        type = 'string|symbol';
        break;
      case [
        'rolls.data.rollerId',
        'rolls.options.rollerId',
        'speaker.actor',
        'speaker.scene',
        'speaker.token',
        'user',
        'whisper',
      ].includes(location):
        type = 'ID';
        break;
      case [
        'rolls.data.strike.actor',
        'rolls.options.damage.damage.modifiers.source',
        'rolls.options.damage.numericModifiers.source',
        'rolls.options.strike.actor',
      ].includes(location):
        type = 'Source ID';
        break;
      case /d\d+/i.test(curr.value) || /\d+\[/i.test(curr.value) || /\d+dc/i.test(curr.value):
        if (
          [''].some((regex) =>
            new RegExp(
              `^${regex.replace(/\./g, '\\.').replace(/\{\w+\}/g, (match) => {
                const replacement = replacements[match.slice(1, -1) as keyof typeof replacements]; // remove curly braces around match
                return replacement !== undefined ? replacement : match;
              })}$`
            ).test(location)
          ) ||
          [
            /^\dd\d+ \w+ damage$/,
            /^\dd\d+ Hit Points$/,
            /^\dd\d+ bludgeoning$/,
            /^\dd\d+ damage$/,
            /^\dd\d+\+\d+ \w+ damage$/,
            /^Spiked Chain: 1d4 \+ 4 mental$/,
            /^\/ rd20\+1$/,
            /^\{?\d+\[[a-z,]+\]\}?$/,
            /^\d+dc$/,
          ].some((regex) => regex.test(curr.value as string))
        )
          type = 'die';
        else type = 'string';
        if (
          !(
            [
            ].includes(location) || type === 'die'
          )
        ) {
          let key = location;
          for (const replacement in replacements) {
            key = key.replace(
              new RegExp(`${replacements[replacement as keyof typeof replacements]}`),
              `{${replacement}}`
            );
          }
          console.log('string::die::valid?', '\n' + `'${key}',`, '\n' + curr.value, /d\d+/i.test(curr.value));
        }
        break;
      default:
        type = 'string';
        if (!Number.isNaN(parseFloat(curr.value)) && ![''].includes(location) && ![''].includes(curr.value))
          console.log('string::number::valid?' + `'${location}'`, curr.value, parseFloat(curr.value), parent);
        assert([''], 'string', parent, curr.value);
    }
  } else if (Array.isArray(curr.value)) {
    if (curr.value.length === 0) {
      switch (true) {
        case Object.keys(done).includes(location):
          type = fill(parent, 'array');
          break;
        default:
          if ([''].includes(location)) console.warn(`array::empty<<${location}>>`, curr.value, parent);
          toDo[location] ??= new Set();
          break;
      }
    } else if (curr.value.every((v) => typeof v === 'object' && v !== null)) {
      const types = [
        ...new Set(
          curr.value.map((v) => getStructure({ key: location, value: v, parent: { parent, location: location } }).value)
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert([''], 'array::allObjects', parent, curr.value, type);
    } else if (!curr.value.some((v) => v === null)) {
      const types = [
        ...new Set(
          curr.value.map((v) => getStructure({ key: location, value: v, parent: { parent, location: location } }).value)
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert([''], 'array::types', parent, curr.value, type);
    } else {
      const types = [
        ...new Set(
          curr.value.map((v) => getStructure({ key: location, value: v, parent: { parent, location: location } }).value)
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert(
        [''],
        'array::other',
        parent,
        curr.value,
        type,
        curr.value.map((v) => typeof v)
      );
    }
  } else if (curr.value instanceof Object) {
    if (Object.keys(curr.value).length === 0) {
      switch (true) {
        case Object.keys(done).includes(location):
          type = fill(parent, 'object');
          break;
        default:
          if ([''].includes(location)) console.warn(`object::empty<<${location}>>`, curr.value, parent);
          toDo[location] ??= new Set();
          type = '{}';
          break;
      }
    } else {
      const keys = Object.keys(curr.value).sort();
      const sortedObj: ObjectStructure = {};

      for (const key of keys) {
        const val = curr.value[key];
        const location = parent?.location ? `${parent.location}.${key}` : key;

        const { key: tKey, value } = getStructure({ key, value: val, parent: { parent, location } });
        if (value) sortedObj[tKey] = value;

        if (Object.keys(toVerify).includes(location)) toVerify[location].add(val);
        if (Object.keys(toDo).includes(location) && val) {
          toDo[location] ??= new Set();

          if (Array.isArray(val) && val.length) {
            val.forEach(() => {
              if (!done[location]?.has(value as string)) toDo[location].add(val);
            });
          } else {
            if (!done[location]?.has(value as string)) toDo[location].add(val);
          }
        }
      }
      if (Object.keys(sortedObj).length) type = sortedObj;
      else type = '{}';
      assert([''], 'object', parent, curr.value, type);
    }
  } else {
    debugger;
    console.log(location, curr.value, typeof curr.value);
  }

  if (last && Object.values(toDo).some((t) => t.size)) {
    console.group('____');
    console.log(
      '____',
      'keys',
      '____',
      '\n' +
        Object.keys(toDo)
          .filter((k) => !Object.keys(done).includes(k))
          .map((k) => `'${k}': new Set(),`)
          .sort()
          .join('\n')
    );
    console.log(
      '____',
      'new',
      '____',
      '\n' +
        Object.keys(toDo)
          .filter((k) => !Object.keys(toDo).includes(k))
          .map((k) => `'${k}': new Set(),`)
          .sort()
          .join('\n')
    );
    console.log(
      '____',
      'values',
      '____',
      '\n' +
        Object.keys(toDo)
          .filter((k) => toDo[k].size)
          .filter((k) => !Object.keys(done).includes(k))
          .map((k) => `case '${k}':`)
          .sort()
          .join('\n')
    );
    for (const key in toDo) {
      const val = [...toDo[key].values()].flat();
      const location = parent?.location ? `${parent.location}.${key}` : key;

      const types = [
        ...new Set(
          val.map((v) => {
            const k = getStructure({
              key: location,
              value: isValidJSON(v as string) ? JSON.parse(v as string) : v,
              parent: { parent, location: location },
            }).value;
            // console.log(key, v, typeof v, k, typeof k);
            return typeof k === 'object' ? JSON.stringify(k) : k;
          })
        ),
      ];
      if (val.length && types.filter((t) => ![...(done[key] || [])].includes(t as string)).length) {
        console.group('____\n', `'${key}': new Set(),`);
        console.log('vals ' + key, val, types);
        console.log(
          '____' + key,
          types,
          types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t))
        );
        if (!done[key])
          console.log(`'${key}': new Set([${types.map((t) => '\n  ' + JSON.stringify(t) + ',').join('')}\n]),`);
        else
          console.log(
            `${types
              .filter((t) => ![...done[key].values()].includes(t as string))
              .map((t) => '  ' + JSON.stringify(t) + ',')
              .join('\n')}`
          );
        console.groupEnd();
      }
    }
    for (const key in toVerify) {
      console.info(`toVerify::filling<<${key}>>`, toVerify[key]);
    }
    console.groupEnd();
  }

  return { key: curr.key, value: type as ObjectStructure, data: curr.value };
}
