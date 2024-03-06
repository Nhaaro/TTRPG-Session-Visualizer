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

const done: Record<string, Set<string>> = {
  content: new Set(['int', 'html', 'string']),
  'data.rolls.result.values': new Set(['int']),
  'data.rolls.diceNotation.set': new Set([
    '{"count":"int","dice":[{"dieType":"string","dieValue":"int"}],"dieType":"string","operation":"int"}',
    '{"count":"int","dice":[{"dieType":"string","dieValue":"int"},{"dieType":"string","dieValue":"int"}],"dieType":"string","operation":"int"}',
  ]),
  flavor: new Set(['html']),
  rolls: new Set([
    '{"class":"string","evaluated":"boolean","formula":"string","options":{"damage":{"base":{"category":"string","damageType":"string","diceNumber":"int","dieSize":"die","modifier":"int"},"effectDice":"int","formula":{"criticalSuccess":{"data":{"baseDamageType":"string","effectiveDamageDice":"int"},"formula":"string","partials":{"piercing":{"physical":"string"}}},"success":{"data":{"baseDamageType":"string","effectiveDamageDice":"int"},"formula":"string","partials":{"piercing":{"physical":"string"}}}},"name":"string","traits":["string"]},"degreeOfSuccess":"int","result":{"baseDamageDice":"int","diceResults":{"piercing":{"physical":[{"faces":"int","result":"int"}]}},"outcome":"string","total":"int","traits":["string"],"types":{"piercing":{"physical":"int"}}},"rollerId":"ID"},"terms":[{"class":"string","evaluated":"boolean","results":[{"active":"boolean","result":"int"}],"rolls":[{"class":"string","evaluated":"boolean","formula":"string","terms":[{"class":"string","evaluated":"boolean","faces":"int","number":"int","results":[{"active":"boolean","result":"int"}]},{"class":"string","evaluated":"boolean","operator":"string|symbol"},{"class":"string","evaluated":"boolean","number":"int"}],"total":"int"}],"terms":["string"]}],"total":"int"}',
  ]),
  'rolls.options.damage.damage.dice.damageType': new Set(['string']),
  'rolls.options.damage.damage.dice': new Set([
    '{"custom":"boolean","damageType":"string","diceNumber":"int","dieSize":"die","enabled":"boolean","ignored":"boolean","label":"string","predicate":[{"nor":["string"]}],"selector":"string","slug":"string"}',
  ]),
  'rolls.options.damage.damage.dice.predicate': new Set(['string', '{"nor":["string"]}']),
  'rolls.options.damage.damage.modifiers.ability': new Set(['string']),
  'rolls.options.damage.damage.modifiers.damageType': new Set(['string']),
  'rolls.options.damage.damage.modifiers': new Set([
    '{"custom":"boolean","enabled":"boolean","force":"boolean","hideIfDisabled":"boolean","ignored":"boolean","kind":"string","label":"string","modifier":"int","predicate":["string",{"not":"string"}],"slug":"string","source":"Source ID","type":"string"}',
  ]),
  'rolls.options.damage.damage.modifiers.predicate': new Set(['string', '{"nor":["string"]}', '{"not":"string"}']),
  'rolls.options.damage.damage.modifiers.source': new Set(['Source ID']),
  'rolls.options.damage.diceModifiers.category': new Set(['string']),
  'rolls.options.damage.diceModifiers.critical': new Set(['boolean']),
  'rolls.options.damage.diceModifiers.dieSize': new Set(['die']),
  'rolls.options.damage.diceModifiers': new Set([
    '{"category":"string","custom":"boolean","diceNumber":"int","dieSize":"die","enabled":"boolean","ignored":"boolean","label":"string","predicate":["string",{"or":["string",{"and":["string",{"not":"string"}]}]}],"selector":"string","slug":"string"}',
    '{"category":"string","custom":"boolean","diceNumber":"int","dieSize":"die","enabled":"boolean","ignored":"boolean","label":"string","predicate":["string",{"or":["string"]}],"selector":"string","slug":"string"}',
    '{"critical":"boolean","custom":"boolean","diceNumber":"int","dieSize":"die","enabled":"boolean","ignored":"boolean","label":"string","slug":"string"}',
    '{"custom":"boolean","diceNumber":"int","enabled":"boolean","ignored":"boolean","label":"string","slug":"string"}',
  ]),
  'rolls.options.damage.diceModifiers.predicate': new Set([
    '{"or":["string"]}',
    '{"or":["string",{"and":["string",{"not":"string"}]}]}',
    'string',
  ]),
  'rolls.options.damage.modifiers.damageType': new Set(['string']),
  'rolls.options.damage.modifiers': new Set([
    '{"ability":"string","custom":"boolean","damageType":"string","enabled":"boolean","force":"boolean","hideIfDisabled":"boolean","ignored":"boolean","kind":"string","label":"string","modifier":"int","slug":"string","type":"string"}',
  ]),
  'rolls.options.damage.modifiers.predicate': new Set(['string', '{"nor":["string"]}']),
  'rolls.options.damage.notes': new Set(['{"outcome":["string"],"selector":"string"}']),
  'rolls.options.damage.numericModifiers.ability': new Set(['string']),
  'rolls.options.damage.numericModifiers': new Set([
    '{"ability":"string","custom":"boolean","damageCategory":"string","damageType":"string","enabled":"boolean","force":"boolean","hideIfDisabled":"boolean","ignored":"boolean","label":"string","modifier":"int","predicate":["string",{"nor":["string"]},{"not":"string"}],"slug":"string","source":"Source ID","type":"string"}',
    '{"ability":"string","custom":"boolean","damageCategory":"string","damageType":"string","enabled":"boolean","force":"boolean","hideIfDisabled":"boolean","ignored":"boolean","label":"string","modifier":"int","predicate":["string",{"nor":["string"]}],"slug":"string","source":"Source ID","type":"string"}',
    '{"ability":"string","custom":"boolean","damageCategory":"string","damageType":"string","enabled":"boolean","force":"boolean","hideIfDisabled":"boolean","ignored":"boolean","label":"string","modifier":"int","predicate":["string",{"not":"string"}],"slug":"string","source":"Source ID","type":"string"}',
  ]),
  'rolls.options.damage.numericModifiers.predicate': new Set(['string', '{"nor":["string"]}', '{"not":"string"}']),
  'rolls.options.damage.numericModifiers.source': new Set(['Source ID']),
  'rolls.terms.modifiers': new Set(['string']),
  'rolls.terms.options': new Set(['{"flavor":"string"}']),
  'rolls.terms.rolls.options': new Set([
    '{"critRule":"string"}',
    '{"critRule":"string","evaluatePersistent":"boolean","flavor":"string"}',
    '{"critRule":"string","flavor":"string"}',
    '{"flavor":"string"}',
  ]),
  'rolls.terms.rolls.terms.options': new Set(['{"flavor":"string"}']),
  'rolls.terms.rolls.terms.term.operands.operands.options': new Set(['{"crit":"int"}']),
  'rolls.terms.rolls.terms.term.operands.options': new Set(['{"crit":"int"}']),
  'rolls.terms.rolls.terms.term.options': new Set(['{"flavor":"string"}']),
  sound: new Set(['file|sound']),
  'speaker.actor': new Set(['ID']),
  'speaker.alias': new Set(['string']),
  'speaker.scene': new Set(['ID']),
  'speaker.token': new Set(['ID']),
  user: new Set(['ID']),
  whisper: new Set(['ID']),
};
const toDo: Record<string, Set<unknown>> = {
  'rolls.terms.rolls.terms.operands.options': new Set(),
  content: new Set(),
  flavor: new Set(),
  'rolls.dice': new Set(),
  rolls: new Set(),
  'rolls.options.damage.damage.base.materials': new Set(),
  'rolls.options.damage.damage.breakdown.criticalFailure': new Set(),
  'rolls.options.damage.damage.dice': new Set(),
  'rolls.options.damage.damage.dice.predicate': new Set(),
  'rolls.options.damage.damage.ignoredResistances': new Set(),
  'rolls.options.damage.damage.modifiers.adjustments': new Set(),
  'rolls.options.damage.damage.modifiers': new Set(),
  'rolls.options.damage.damage.modifiers.predicate': new Set(),
  'rolls.options.damage.damage.modifiers.traits': new Set(),
  'rolls.options.damage.diceModifiers': new Set(),
  'rolls.options.damage.materials': new Set(),
  'rolls.options.damage.modifiers.adjustments': new Set(),
  'rolls.options.damage.modifiers': new Set(),
  'rolls.options.damage.modifiers.predicate': new Set(),
  'rolls.options.damage.modifiers.traits': new Set(),
  'rolls.options.damage.notes': new Set(),
  'rolls.options.damage.notes.predicate': new Set(),
  'rolls.options.damage.numericModifiers.adjustments': new Set(),
  'rolls.options.damage.numericModifiers': new Set(),
  'rolls.options.damage.numericModifiers.predicate': new Set(),
  'rolls.options.damage.numericModifiers.traits': new Set(),
  'rolls.options.ignoredResistances': new Set(),
  'rolls.term.modifiers': new Set(),
  'rolls.terms.modifiers': new Set(),
  'rolls.terms.rolls.dice': new Set(),
  'rolls.terms.rolls.terms.modifiers': new Set(),
  'rolls.terms.rolls.terms.operands.modifiers': new Set(),
  'rolls.terms.rolls.terms.term.modifiers': new Set(),
  'rolls.terms.rolls.terms.term.operands.modifiers': new Set(),
  'rolls.terms.rolls.terms.term.operands.operands.modifiers': new Set(),
  'rolls.terms.rolls.terms.term.operands.term.modifiers': new Set(),
  'rolls.terms.rolls.terms.term.operands.term.operands.modifiers': new Set(),
  'speaker.actor': new Set(),
  'speaker.alias': new Set(),
  'speaker.scene': new Set(),
  'speaker.token': new Set(),
  whisper: new Set(),
  user: new Set(),
};
const toVerify: Record<string, Set<unknown>> = {
  'rolls.formula': new Set(),
  'speaker.actor': new Set(),
  'speaker.alias': new Set(),
  'speaker.scene': new Set(),
  'speaker.token': new Set(),
  whisper: new Set(),
};
(globalThis as any).done = done;
(globalThis as any).todo = toDo;
(globalThis as any).toVerify = toVerify;

const replacements = {
  degreeOfSuccess: '(criticalSuccess|criticalFailure|success|failure)',
  physicalDamage: '(slashing|bludgeoning|piercing)',
  energyDamage: '(acid|fire|negative|positive)',
};

function fill({ location, ...parent }: Parent, valueType: string) {
  let type = [...done[location].values()].map((v) => (isValidJSON(v) ? JSON.parse(v) : v));
  if (type.length === 1 && !['flavor', 'content'].includes(location)) {
    if (
      ![
        'rolls',
        'rolls.options.damage.damage.dice',
        'rolls.options.damage.damage.dice.damageType',
        'rolls.options.damage.damage.modifiers',
        'rolls.options.damage.damage.modifiers.ability',
        'rolls.options.damage.damage.modifiers.damageType',
        'rolls.options.damage.damage.modifiers.source',
        'rolls.options.damage.diceModifiers.category',
        'rolls.options.damage.diceModifiers.critical',
        'rolls.options.damage.diceModifiers.dieSize',
        'rolls.options.damage.modifiers',
        'rolls.options.damage.modifiers.damageType',
        'rolls.options.damage.notes',
        'rolls.options.damage.numericModifiers',
        'rolls.options.damage.numericModifiers.ability',
        'rolls.options.damage.numericModifiers.source',
        'rolls.terms.modifiers',
        'rolls.terms.options',
        'rolls.terms.rolls.options',
        'rolls.terms.rolls.terms.options',
        'rolls.terms.rolls.terms.term.operands.operands.options',
        'rolls.terms.rolls.terms.term.operands.options',
        'rolls.terms.rolls.terms.term.options',
        'sound',
        'speaker.actor',
        'speaker.alias',
        'speaker.scene',
        'speaker.token',
        'user',
        'whisper',
      ].includes(location)
    ) {
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
  curr: { key: string; value: JSONValue; parent: Parent; structuresMap: Map<string, Set<unknown>> },
  last?: boolean
): { key: string; value: string | string[] | ObjectStructure | false } {
  const { parent, structuresMap } = curr;
  const { location } = parent;

  const stringLocation = location + (parent.parent?.location && curr.key === location ? '[]' : '');
  if (!structuresMap.has(stringLocation)) structuresMap.set(stringLocation, new Set());
  structuresMap.get(stringLocation)?.add(curr.value);

  let type;
  if (['flags', '_id'].includes(location)) return { key: curr.key, value: false };

  if (typeof curr.value === 'boolean') {
    type = typeof curr.value;
  } else if (curr.value === null) {
    switch (true) {
      case Object.keys(done).includes(location):
        type = fill(parent, 'null');
        if (!['boolean', 'die', 'file|sound', 'ID', 'Source ID', 'string'].includes(type as unknown as string))
          console.log('fill|null', location, type);
        if (
          ![
            'rolls.options.damage.diceModifiers.critical boolean',
            'rolls.options.damage.numericModifiers.ability',
            'rolls.options.damage.numericModifiers.source',
            'whisper',
          ].includes(location)
        )
          type = 'null';
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
        assert(
          [
            'content',
            'rolls.data.degreeOfSuccess',
            'rolls.data.strike.index',
            'rolls.options.damage.base.diceNumber',
            'rolls.options.damage.base.modifier',
            'rolls.options.damage.damage.base.diceNumber',
            'rolls.options.damage.damage.base.modifier',
            'rolls.options.damage.damage.dice.diceNumber',
            'rolls.options.damage.damage.modifiers.modifier',
            'rolls.options.damage.diceModifiers.diceNumber',
            'rolls.options.damage.effectDice',
            'rolls.options.damage.formula.{degreeOfSuccess}.data.effectiveDamageDice',
            'rolls.options.damage.modifiers.diceNumber',
            'rolls.options.damage.modifiers.modifier',
            'rolls.options.damage.numericModifiers.modifier',
            'rolls.options.degreeOfSuccess',
            'rolls.options.result.baseDamageDice',
            'rolls.options.result.diceResults.{energyDamage}.energy.faces',
            'rolls.options.result.diceResults.{energyDamage}.energy.result',
            'rolls.options.result.diceResults.{physicalDamage}.physical.faces',
            'rolls.options.result.diceResults.{physicalDamage}.physical.result',
            'rolls.options.result.diceResults.{physicalDamage}.precision.faces',
            'rolls.options.result.diceResults.{physicalDamage}.precision.result',
            'rolls.options.result.total',
            'rolls.options.result.types.{energyDamage}.energy',
            'rolls.options.result.types.{physicalDamage}.physical',
            'rolls.options.result.types.{physicalDamage}.precision',
            'rolls.options.strike.index',
            'rolls.options.totalModifier',
            'rolls.terms.faces',
            'rolls.terms.number',
            'rolls.terms.results.result',
            'rolls.terms.rolls.terms.faces',
            'rolls.terms.rolls.terms.number',
            'rolls.terms.rolls.terms.operands.faces',
            'rolls.terms.rolls.terms.operands.number',
            'rolls.terms.rolls.terms.operands.results.result',
            'rolls.terms.rolls.terms.results.result',
            'rolls.terms.rolls.terms.term.faces',
            'rolls.terms.rolls.terms.term.number',
            'rolls.terms.rolls.terms.term.operands.faces',
            'rolls.terms.rolls.terms.term.operands.number',
            'rolls.terms.rolls.terms.term.operands.operands.faces',
            'rolls.terms.rolls.terms.term.operands.operands.number',
            'rolls.terms.rolls.terms.term.operands.operands.options.crit',
            'rolls.terms.rolls.terms.term.operands.operands.results.result',
            'rolls.terms.rolls.terms.term.operands.options.crit',
            'rolls.terms.rolls.terms.term.operands.results.result',
            'rolls.terms.rolls.terms.term.operands.term.faces',
            'rolls.terms.rolls.terms.term.operands.term.number',
            'rolls.terms.rolls.terms.term.operands.term.operands.faces',
            'rolls.terms.rolls.terms.term.operands.term.operands.number',
            'rolls.terms.rolls.terms.term.operands.term.operands.options.crit',
            'rolls.terms.rolls.terms.term.operands.term.operands.results.result',
            'rolls.terms.rolls.terms.term.operands.term.options.crit',
            'rolls.terms.rolls.terms.term.operands.term.results.result',
            'rolls.terms.rolls.terms.term.results.result',
            'rolls.terms.rolls.total',
            'rolls.total',
            'type',
          ],
          'number',
          parent,
          curr.value
        );
        type = Number.parseInt('' + curr.value) === Number.parseFloat('' + curr.value) ? 'int' : 'float';
        break;
    }
  } else if (typeof curr.value === 'string') {
    switch (true) {
      case curr.value === '':
        switch (true) {
          case Object.keys(done).includes(location):
            type = fill(parent, 'string');
            if (!['["html"]', '["int","html","string"]', '"string"'].includes(JSON.stringify(type)))
              console.log('fill|string', location, type);
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
          structuresMap,
        }).value;
        assert(['rolls'], 'string::object', parent, {
          value: curr.value,
          parsed: JSON.parse(curr.value),
          type,
        });
        break;
      case isValidHtml(curr.value):
        type = 'html';
        assert(['content', 'flavor'], 'string::html', parent, curr.value);
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
          [
            'rolls.formula',
            'rolls.options.damage.base.dieSize',
            'rolls.options.damage.damage.base.dieSize',
            'rolls.options.damage.damage.breakdown.{degreeOfSuccess}',
            'rolls.options.damage.damage.dice.dieSize',
            'rolls.options.damage.damage.formula.{degreeOfSuccess}',
            'rolls.options.damage.diceModifiers.dieSize',
            'rolls.options.damage.formula.{degreeOfSuccess}.formula',
            'rolls.options.damage.formula.{degreeOfSuccess}.partials.{energyDamage}.energy',
            'rolls.options.damage.formula.{degreeOfSuccess}.partials.{physicalDamage}.physical',
            'rolls.options.damage.formula.{degreeOfSuccess}.partials.{physicalDamage}.precision',
            'rolls.options.damage.modifiers.dieSize',
            'rolls.terms.rolls.formula',
            'rolls.terms.terms',
          ].some((regex) =>
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
              'rolls.options.damage.damage.dice.label',
              'rolls.options.damage.diceModifiers.label',
              'rolls.options.damage.diceModifiers.slug',
              'rolls.options.damage.domains',
              'rolls.options.damage.modifiers.label',
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
        if (
          !Number.isNaN(parseFloat(curr.value)) &&
          !['rolls.data.strike.name', 'rolls.options.strike.name'].includes(location) &&
          !['9oh5gnhfvbqr9btt-damage', '7ASsgG1v1611ihJD-damage', '2-Action Healing', '8dc'].includes(curr.value)
        )
          console.log('string::number::valid?' + `'${location}'`, curr.value, parseFloat(curr.value), parent);
        assert(
          [
            'content',
            'flavor',
            'rolls.class',
            'rolls.data.strike.name',
            'rolls.options.critRule',
            'rolls.options.damage.base.category',
            'rolls.options.damage.base.damageType',
            'rolls.options.damage.damage.base.damageType',
            'rolls.options.damage.damage.breakdown.{degreeOfSuccess}',
            'rolls.options.damage.damage.dice.damageType',
            'rolls.options.damage.damage.dice.predicate',
            'rolls.options.damage.damage.dice.predicate.nor',
            'rolls.options.damage.damage.dice.selector',
            'rolls.options.damage.damage.dice.slug',
            'rolls.options.damage.damage.modifiers.ability',
            'rolls.options.damage.damage.modifiers.damageType',
            'rolls.options.damage.damage.modifiers.kind',
            'rolls.options.damage.damage.modifiers.label',
            'rolls.options.damage.damage.modifiers.predicate',
            'rolls.options.damage.damage.modifiers.predicate.nor',
            'rolls.options.damage.damage.modifiers.predicate.not',
            'rolls.options.damage.damage.modifiers.slug',
            'rolls.options.damage.damage.modifiers.type',
            'rolls.options.damage.diceModifiers.category',
            'rolls.options.damage.diceModifiers.predicate',
            'rolls.options.damage.diceModifiers.predicate.or',
            'rolls.options.damage.diceModifiers.predicate.or.and',
            'rolls.options.damage.diceModifiers.predicate.or.and.not',
            'rolls.options.damage.diceModifiers.selector',
            'rolls.options.damage.diceModifiers.slug',
            'rolls.options.damage.domains',
            'rolls.options.damage.formula.{degreeOfSuccess}.data.baseDamageType',
            'rolls.options.damage.modifiers.ability',
            'rolls.options.damage.modifiers.damageType',
            'rolls.options.damage.modifiers.kind',
            'rolls.options.damage.modifiers.label',
            'rolls.options.damage.modifiers.predicate',
            'rolls.options.damage.modifiers.predicate.nor',
            'rolls.options.damage.modifiers.selector',
            'rolls.options.damage.modifiers.slug',
            'rolls.options.damage.modifiers.type',
            'rolls.options.damage.name',
            'rolls.options.damage.notes.outcome',
            'rolls.options.damage.notes.selector',
            'rolls.options.damage.notes.visibility',
            'rolls.options.damage.numericModifiers.ability',
            'rolls.options.damage.numericModifiers.damageCategory',
            'rolls.options.damage.numericModifiers.damageType',
            'rolls.options.damage.numericModifiers.label',
            'rolls.options.damage.numericModifiers.predicate',
            'rolls.options.damage.numericModifiers.predicate.nor',
            'rolls.options.damage.numericModifiers.predicate.not',
            'rolls.options.damage.numericModifiers.slug',
            'rolls.options.damage.numericModifiers.type',
            'rolls.options.damage.traits',
            'rolls.options.flavor',
            'rolls.options.result.outcome',
            'rolls.options.result.traits',
            'rolls.options.strike.name',
            'rolls.terms.class',
            'rolls.terms.modifiers',
            'rolls.terms.options.flavor',
            'rolls.terms.rolls.class',
            'rolls.terms.rolls.options.critRule',
            'rolls.terms.rolls.options.flavor',
            'rolls.terms.rolls.terms.class',
            'rolls.terms.rolls.terms.operands.class',
            'rolls.terms.rolls.terms.options.flavor',
            'rolls.terms.rolls.terms.term.class',
            'rolls.terms.rolls.terms.term.operands.class',
            'rolls.terms.rolls.terms.term.operands.operands.class',
            'rolls.terms.rolls.terms.term.operands.term.class',
            'rolls.terms.rolls.terms.term.operands.term.operands.class',
            'rolls.terms.rolls.terms.term.operands.term.options.flavor',
            'rolls.terms.rolls.terms.term.options.flavor',
            'speaker.alias',
          ],
          'string',
          parent,
          curr.value
        );
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
          curr.value.map(
            (v) =>
              getStructure({ key: location, value: v, parent: { parent, location: location }, structuresMap }).value
          )
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert(
        [
          'rolls.options.damage.damage.dice',
          'rolls.options.damage.damage.dice.predicate',
          'rolls.options.damage.damage.modifiers',
          'rolls.options.damage.diceModifiers',
          'rolls.options.damage.modifiers',
          'rolls.options.damage.modifiers.predicate',
          'rolls.options.damage.notes',
          'rolls.options.damage.numericModifiers',
          'rolls.options.damage.numericModifiers.predicate',
          'rolls.options.result.diceResults.{energyDamage}.energy',
          'rolls.options.result.diceResults.{physicalDamage}.physical',
          'rolls.options.result.diceResults.{physicalDamage}.precision',
          'rolls.terms',
          'rolls.terms.results',
          'rolls.terms.rolls',
          'rolls.terms.rolls.terms',
          'rolls.terms.rolls.terms.operands',
          'rolls.terms.rolls.terms.operands.results',
          'rolls.terms.rolls.terms.results',
          'rolls.terms.rolls.terms.term.operands',
          'rolls.terms.rolls.terms.term.operands.operands',
          'rolls.terms.rolls.terms.term.operands.operands.results',
          'rolls.terms.rolls.terms.term.operands.results',
          'rolls.terms.rolls.terms.term.operands.term.operands',
          'rolls.terms.rolls.terms.term.operands.term.operands.results',
          'rolls.terms.rolls.terms.term.operands.term.results',
          'rolls.terms.rolls.terms.term.results',
        ],
        'array::allObjects',
        parent,
        curr.value,
        type
      );
    } else if (!curr.value.some((v) => v === null)) {
      const types = [
        ...new Set(
          curr.value.map(
            (v) =>
              getStructure({ key: location, value: v, parent: { parent, location: location }, structuresMap }).value
          )
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert(
        [
          'rolls',
          'rolls.options.damage.damage.breakdown.{degreeOfSuccess}',
          'rolls.options.damage.damage.dice.predicate',
          'rolls.options.damage.damage.dice.predicate.nor',
          'rolls.options.damage.damage.modifiers.predicate',
          'rolls.options.damage.damage.modifiers.predicate.nor',
          'rolls.options.damage.diceModifiers.predicate',
          'rolls.options.damage.diceModifiers.predicate.or',
          'rolls.options.damage.diceModifiers.predicate.or.and',
          'rolls.options.damage.domains',
          'rolls.options.damage.modifiers.predicate',
          'rolls.options.damage.modifiers.predicate.nor',
          'rolls.options.damage.notes.outcome',
          'rolls.options.damage.numericModifiers.predicate',
          'rolls.options.damage.numericModifiers.predicate.nor',
          'rolls.options.damage.traits',
          'rolls.options.result.traits',
          'rolls.terms.modifiers',
          'rolls.terms.terms',
          'whisper',
        ],
        'array::mixed',
        parent,
        curr.value,
        type
      );
    } else {
      const verified = ['whisper'];
      if (!verified.includes(location)) debugger;
      const types = [
        ...new Set(
          curr.value.map(
            (v) =>
              getStructure({ key: location, value: v, parent: { parent, location: location }, structuresMap }).value
          )
        ),
      ];
      type = types.map((t) => (isValidJSON(t as string) ? JSON.parse(t as string) : t));
      assert(
        verified,
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
          if (
            !(
              [
                '"ID"',
                '{"flavor":"string"}',
                '{"crit":"int"}',
                '{"critRule":"string","evaluatePersistent":"boolean","flavor":"string"}',
              ].includes(JSON.stringify(type)) || ['rolls.terms.rolls.options'].includes(location)
            )
          )
            console.log('fill|object', location, type);
          break;
        default:
          if (
            ![
              'rolls.options',
              'rolls.terms.rolls.terms.operands.options',
              'rolls.terms.rolls.terms.term.operands.operands.options',
              'rolls.terms.rolls.terms.term.operands.options',
              'rolls.terms.rolls.terms.term.options',
              'roll.terms.options',
            ].includes(location)
          ) {
            console.warn(`object::empty<<${location}>>`, curr.value, parent);
            debugger;
          }
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

        const { key: tKey, value } = getStructure({ key, value: val, parent: { parent, location }, structuresMap });
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
      assert(
        [
          '',
          'rolls',
          'rolls.data',
          'rolls.data.strike',
          'rolls.options',
          'rolls.options.damage',
          'rolls.options.damage.base',
          'rolls.options.damage.damage',
          'rolls.options.damage.damage.base',
          'rolls.options.damage.damage.breakdown',
          'rolls.options.damage.damage.dice',
          'rolls.options.damage.damage.dice.predicate',
          'rolls.options.damage.damage.formula',
          'rolls.options.damage.damage.modifiers',
          'rolls.options.damage.damage.modifiers.predicate',
          'rolls.options.damage.diceModifiers',
          'rolls.options.damage.diceModifiers.predicate',
          'rolls.options.damage.diceModifiers.predicate.or',
          'rolls.options.damage.diceModifiers.predicate.or.and',
          'rolls.options.damage.formula',
          'rolls.options.damage.formula.{degreeOfSuccess}',
          'rolls.options.damage.formula.{degreeOfSuccess}.data',
          'rolls.options.damage.formula.{degreeOfSuccess}.partials',
          'rolls.options.damage.formula.{degreeOfSuccess}.partials.{energyDamage}',
          'rolls.options.damage.formula.{degreeOfSuccess}.partials.{physicalDamage}',
          'rolls.options.damage.modifiers',
          'rolls.options.damage.modifiers.predicate',
          'rolls.options.damage.notes',
          'rolls.options.damage.numericModifiers',
          'rolls.options.damage.numericModifiers.predicate',
          'rolls.options.result',
          'rolls.options.result.diceResults',
          'rolls.options.result.diceResults.{energyDamage}',
          'rolls.options.result.diceResults.{energyDamage}.energy',
          'rolls.options.result.diceResults.{physicalDamage}',
          'rolls.options.result.diceResults.{physicalDamage}.physical',
          'rolls.options.result.diceResults.{physicalDamage}.precision',
          'rolls.options.result.types',
          'rolls.options.result.types.{energyDamage}',
          'rolls.options.result.types.{physicalDamage}',
          'rolls.options.strike',
          'rolls.terms',
          'rolls.terms.options',
          'rolls.terms.results',
          'rolls.terms.rolls',
          'rolls.terms.rolls.options',
          'rolls.terms.rolls.terms',
          'rolls.terms.rolls.terms.operands',
          'rolls.terms.rolls.terms.operands.results',
          'rolls.terms.rolls.terms.options',
          'rolls.terms.rolls.terms.results',
          'rolls.terms.rolls.terms.term',
          'rolls.terms.rolls.terms.term.operands',
          'rolls.terms.rolls.terms.term.operands.operands',
          'rolls.terms.rolls.terms.term.operands.operands.options',
          'rolls.terms.rolls.terms.term.operands.operands.results',
          'rolls.terms.rolls.terms.term.operands.options',
          'rolls.terms.rolls.terms.term.operands.results',
          'rolls.terms.rolls.terms.term.operands.term',
          'rolls.terms.rolls.terms.term.operands.term.operands',
          'rolls.terms.rolls.terms.term.operands.term.operands.options',
          'rolls.terms.rolls.terms.term.operands.term.operands.results',
          'rolls.terms.rolls.terms.term.operands.term.options',
          'rolls.terms.rolls.terms.term.operands.term.results',
          'rolls.terms.rolls.terms.term.options',
          'rolls.terms.rolls.terms.term.results',
          'speaker',
        ],
        'object',
        parent,
        curr.value,
        type
      );
    }
  } else {
    debugger;
    console.log(location, curr.value, typeof curr.value);
  }

  if (last && Object.values(toDo).some((t) => t.size)) {
    (async function () {
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
                structuresMap,
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
    })();
  }

  return { key: curr.key, value: type as ObjectStructure };
}
