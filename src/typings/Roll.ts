export interface IRoll {
  diceNotation?: DiceNotation
  diceNotationStr?: string
  rollType?: string
  rollKind?: string
  result?: Result
  class?: string
  options?: Options
  dice?: Die2[]
  formula?: string
  terms?: Term[]
  total?: number
  evaluated?: boolean
  data?: Data
}

export interface DiceNotation {
  set: Set[]
  constant: number
}

export interface Set {
  dice: Die[]
  count: number
  dieType: string
  operation: number
}

export interface Die {
  dieType: string
  dieValue: number
}

export interface Result {
  constant: number
  values: number[]
  total: number
  text?: string
}

export interface Options {
  flavor?: string
  advantageMode?: number
  defaultRollMode?: string
  critical: unknown
  fumble?: number
  halflingLucky?: boolean
  reliableTalent?: boolean
  rollMode?: string
  multiplyNumeric?: boolean
  powerfulCritical?: boolean
  targetValue?: number
}

export interface Die2 {
  class: string
  options: unknown
  evaluated: boolean
  number: number
  faces: number
  modifiers: unknown[]
  results: Result2[]
}


export interface Result2 {
  result: number
  active: boolean
}

export interface Term {
  class: string
  options: Options3
  evaluated: boolean
  number?: number
  faces?: number
  modifiers?: string[]
  results?: Result3[]
  terms?: string[]
  rolls?: Roll[]
  operator?: string
}

export interface Options3 {
  flavor?: string
  critical?: number
  fumble?: number
  target?: number
  disadvantage?: boolean
  advantage?: boolean
  baseNumber?: number
}

export interface Result3 {
  result: number
  active: boolean
  discarded?: boolean
}

export interface Roll {
  class: string
  options: unknown
  dice: unknown[]
  formula: string
  terms: Term2[]
  total: number
  evaluated: boolean
}

export interface Term2 {
  class: string
  options: Options5
  evaluated: boolean
  number?: number
  faces?: number
  modifiers?: unknown[]
  results?: Result4[]
  operator?: string
}

export interface Options5 {
  flavor?: string
}

export interface Result4 {
  result: number
  active: boolean
}

export interface Data {
  isReroll?: boolean
  rollerId?: string
  strike?: Strike
  degreeOfSuccess?: number
}

export interface Strike {
  actor: string
  index: number
  name: string
}

