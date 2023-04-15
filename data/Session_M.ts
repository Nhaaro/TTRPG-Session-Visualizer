export interface Session_M {
  timestamp: number
  name?: string
  flavor?: string
  content?: string
  roll?: string
  flags?: Flags
  id?: string
}

export interface Flags {
  "midi-qol"?: MidiQol
  core?: Core
  "monks-little-details"?: MonksLittleDetails
  dnd5e?: Dnd5e
  polyglot?: Polyglot
  "dnd5e-helpers"?: Dnd5eHelpers
  "item-piles"?: ItemPiles
  pf2e?: Pf2e
  "pf2e-target-damage"?: Pf2eTargetDamage
  "pf2e-dorako-ui"?: Pf2eDorakoUi
  persistent?: Persistent
  "monks-tokenbar"?: MonksTokenbar
  "pf2e-ranged-combat"?: Pf2eRangedCombat
  pf2eJB2AMacros?: Pf2eJb2Amacros
  pf2eDorakoUi?: Pf2eDorakoUi2
  lootsheetnpc5e?: Lootsheetnpc5e
  smartdoors?: Smartdoors
}

export interface MidiQol {
  itemUuid: string
  actorUuid: string
  sound: string
  type: number
  itemId?: string
  workflowId: string
  waitForDiceSoNice?: boolean
  roll?: unknown
  damageDetail?: DamageDetail[]
  damageTotal?: number
  otherDamageDetail?: unknown[]
  hideTag?: string[]
  displayId?: string
  isCritical?: boolean
  isFumble?: boolean
  isHit?: boolean
  isHitEC?: boolean
  d20AttackRoll?: number
  bonusDamageDetail?: BonusDamageDetail[]
  bonusDamageTotal?: number
  playSound?: boolean
}

export interface DamageDetail {
  damage: number
  type: string
}

export interface BonusDamageDetail {
  damage: number
  type: string
}

export interface Core {
  canPopout?: boolean
  initiativeRoll?: boolean
  RollTable?: string
}

export interface MonksLittleDetails {
  roundmarker: boolean
}

export interface Dnd5e {
  roll?: Roll2
  itemData?: ItemData
}

export interface Roll2 {
  type: string
  abilityId?: string
  skillId?: string
  itemId?: string
}

export interface ItemData {
  _id?: string
  name: string
  type: string
  img: string
  data: Data
  effects: unknown[]
  folder: unknown
  sort: number
  permission: Permission2
  flags: Flags4
}

export interface Data {
  description: Description
  source?: string
  quantity: number
  weight: number
  price: unknown
  attunement: number
  equipped: boolean
  rarity: string
  identified: boolean
  activation: Activation
  duration: Duration
  target: Target
  range: Range
  uses: Uses
  consume: Consume
  ability?: string
  actionType: string
  attackBonus: unknown
  chatFlavor: string
  critical?: Critical
  damage: Damage
  formula: string
  save: Save
  armor?: Armor
  hp?: Hp
  weaponType?: string
  baseItem?: string
  properties?: Properties
  proficient?: boolean
  attuned?: boolean
  attributes?: Attributes
  consumableType?: string
  charges?: Charges
  _id?: string
  name?: string
  type?: string
  img?: string
  data?: Data2
  effects?: unknown[]
  folder: unknown
  sort?: number
  permission?: Permission
  flags?: Flags3
  toolType?: string
}

export interface Description {
  value: string
  chat: string
  unidentified: string
}

export interface Activation {
  type: string
  cost: number
  condition: string
}

export interface Duration {
  value?: number
  units: string
}

export interface Target {
  value?: number
  width: unknown
  units: string
  type: string
}

export interface Range {
  value?: number
  long?: number
  units: string
  type?: string
}

export interface Uses {
  value: number
  max: unknown
  per: string
  autoDestroy?: boolean
  autoUse?: boolean
}

export interface Consume {
  type: string
  target?: string
  amount: unknown
}

export interface Critical {
  threshold: unknown
  damage: string
}

export interface Damage {
  parts: string[][]
  versatile: string
  value?: string
}

export interface Save {
  ability: string
  dc?: number
  scaling: string
}

export interface Armor {
  value: number
}

export interface Hp {
  value: number
  max: number
  dt: unknown
  conditions: string
}

export interface Properties {
  ada?: boolean
  amm?: boolean
  fin?: boolean
  fir?: boolean
  foc?: boolean
  hvy?: boolean
  lgt?: boolean
  lod?: boolean
  mgc: boolean
  rch?: boolean
  rel?: boolean
  ret?: boolean
  sil?: boolean
  spc?: boolean
  thr?: boolean
  two?: boolean
  ver?: boolean
  nodam?: boolean
  fulldam?: boolean
  halfdam?: boolean
}

export interface Attributes {
  spelldc: number
}

export interface Charges {
  max: number
  value: number
}

export interface Data2 {
  description: Description2
  source?: string
  quantity: number
  weight: number
  price: unknown
  attunement: number
  rarity: string
  identified: boolean
  activation: Activation2
  duration: Duration2
  target: Target2
  range: Range2
  uses: Uses2
  consume: Consume2
  ability?: string
  actionType: string
  attackBonus: unknown
  chatFlavor: string
  critical: Critical2
  damage: Damage2
  formula: string
  save: Save2
  consumableType: string
  attributes?: Attributes2
  charges?: Charges2
  _id?: string
  name: string
  type: string
  img?: string
  equipped?: boolean
  baseItem?: string
  toolType?: string
  properties?: Properties2
  flags?: Flags2
  data?: Data3
  effects?: unknown[]
}

export interface Description2 {
  value: string
  chat: string
  unidentified: string
}

export interface Activation2 {
  type: string
  cost: number
  condition: string
}

export interface Duration2 {
  value?: number
  units: string
}

export interface Target2 {
  value?: number
  width: unknown
  units: string
  type: string
}

export interface Range2 {
  value?: number
  long?: number
  units: string
  type?: string
}

export interface Uses2 {
  value: number
  max: unknown
  per: string
  autoDestroy: boolean
  autoUse: boolean
}

export interface Consume2 {
  type: string
  target?: string
  amount: unknown
}

export interface Critical2 {
  threshold: unknown
  damage: string
}

export interface Damage2 {
  parts: string[][]
  versatile: string
  value?: string
}

export interface Save2 {
  ability: string
  dc?: number
  scaling: string
}

export interface Attributes2 {
  spelldc: number
}

export interface Charges2 {
  max: number
  value: number
}

export interface Properties2 {
  mgc: boolean
}

export interface Flags2 {
  ddbimporter?: Ddbimporter
  betterRolls5e?: BetterRolls5e
  magicitems?: Magicitems
  infusions?: Infusions
}

export interface Ddbimporter {
  dndbeyond: Dndbeyond
  id: number
  entityTypeId: number
  containerEntityId: number
  containerEntityTypeId: number
  definitionEntityTypeId: number
  definitionId: number
  originalName: string
  version: string
  importId: string
}

export interface Dndbeyond {
  type: string
  tags: string[]
  sources: unknown[]
  stackable: boolean
}

export interface BetterRolls5e {
  quickCharges: QuickCharges
}

export interface QuickCharges {
  value: Value
  altValue: AltValue
}

export interface Value {
  use: boolean
  resource: boolean
}

export interface AltValue {
  use: boolean
  resource: boolean
}

export interface Magicitems {
  enabled: boolean
}

export interface Infusions {
  maps: unknown[]
  applied: unknown[]
  infused: boolean
}

export interface Data3 {
  consumableType: string
  uses: Uses3
  description: Description3
  source: unknown
  quantity: number
  weight: number
  price: number
  attunement: number
  equipped: boolean
  rarity: string
  identified: boolean
  activation: Activation3
  duration: Duration3
  target: Target3
  range: Range3
  consume: Consume3
  ability: unknown
  actionType: string
  attackBonus: number
  chatFlavor: string
  critical: Critical3
  damage: Damage3
  formula: string
  save: Save3
  baseItem: string
  toolType: string
  name: string
  type: string
}

export interface Uses3 {
  value: number
  max: number
  per: string
  autoDestroy: boolean
  autoUse: boolean
}

export interface Description3 {
  value: string
  chat: string
  unidentified: string
}

export interface Activation3 {
  type: string
  cost: number
  condition: string
}

export interface Duration3 {
  value: number
  units: string
}

export interface Target3 {
  value: unknown
  width: unknown
  units: string
  type: string
}

export interface Range3 {
  value: unknown
  long: unknown
  units: string
  type: string
}

export interface Consume3 {
  type: string
  target: unknown
  amount: unknown
}

export interface Critical3 {
  threshold: unknown
  damage: string
}

export interface Damage3 {
  parts: string[][]
  versatile: string
  value: string
}

export interface Save3 {
  ability: string
  dc: unknown
  scaling: string
}

export interface Permission {
  default: number
  lmpFiJtQJ7w517Mz: number
}

export interface Flags3 {
  core?: Core2
  enhancedcombathud?: Enhancedcombathud
  betterRolls5e: BetterRolls5e2
  magicitems: Magicitems2
  ddbimporter?: Ddbimporter2
  infusions?: Infusions2
  "midi-qol"?: MidiQol2
}

export interface Core2 {
  sourceId: string
}

export interface Enhancedcombathud {
  set1p: boolean
  set2p: boolean
  set3p: boolean
}

export interface BetterRolls5e2 {
  quickDamage?: QuickDamage
  quickOther?: QuickOther
  quickDesc?: QuickDesc
  quickAttack?: QuickAttack
  quickSave?: QuickSave
  quickProperties?: QuickProperties
  quickFlavor?: QuickFlavor
  quickCharges: QuickCharges2
}

export interface QuickDamage {
  context: Context
  value: Value2
  altValue: AltValue2
}

export interface Context {
  "0": string
}

export interface Value2 {
  "0": boolean
}

export interface AltValue2 {
  "0": boolean
}

export interface QuickOther {
  context: string
  value: boolean
  altValue: boolean
}

export interface QuickDesc {
  value: boolean
  altValue: boolean
}

export interface QuickAttack {
  value: boolean
  altValue: boolean
}

export interface QuickSave {
  value: boolean
  altValue: boolean
}

export interface QuickProperties {
  value: boolean
  altValue: boolean
}

export interface QuickFlavor {
  value: boolean
  altValue: boolean
}

export interface QuickCharges2 {
  value: Value3
  altValue: AltValue3
}

export interface Value3 {
  quantity?: boolean
  use: boolean
  resource?: boolean
}

export interface AltValue3 {
  quantity?: boolean
  use: boolean
  resource?: boolean
}

export interface Magicitems2 {
  enabled: boolean
  equipped?: boolean
  attuned?: boolean
  charges?: string
  chargeType?: string
  destroy?: boolean
  destroyFlavorText?: string
  rechargeable?: boolean
  recharge?: string
  rechargeType?: string
  rechargeUnit?: string
  sorting?: string
  destroyCheck?: string
  spells?: unknown
  feats?: unknown
  tables?: unknown
}

export interface Ddbimporter2 {
  dndbeyond: Dndbeyond2
  id: number
  entityTypeId: number
  containerEntityId?: number
  containerEntityTypeId?: number
  definitionEntityTypeId: number
  definitionId: number
  originalName: string
  version: string
  importId?: string
}

export interface Dndbeyond2 {
  type: string
  tags: string[]
  sources: Source[]
  stackable: boolean
  filterType?: string
}

export interface Source {
  sourceId: number
  pageNumber: number
  sourceType: number
}

export interface Infusions2 {
  maps: unknown[]
  applied: unknown[]
  infused: boolean
}

export interface MidiQol2 {
  effectActivation: boolean
}

export interface Permission2 {
  default: number
  lmpFiJtQJ7w517Mz?: number
  hpSkFBSeIKa9OPHh?: number
}

export interface Flags4 {
  "midi-qol"?: MidiQol3
  itemacro?: Itemacro
  exportSource?: ExportSource
  core?: Core3
  enhancedcombathud?: Enhancedcombathud2
  betterRolls5e?: BetterRolls5e3
  magicitems?: Magicitems3
  ddbimporter?: Ddbimporter3
  infusions?: Infusions3
  "scene-packer"?: ScenePacker
  spellTemplateManager?: SpellTemplateManager
}

export interface MidiQol3 {
  onUseMacroName?: string
  isConcentrationCheck?: boolean
  effectActivation?: boolean
}

export interface Itemacro {
  macro: Macro
}

export interface Macro {
  data: Data4
}

export interface Data4 {
  _id: unknown
  name: string
  type: string
  author: string
  img: string
  scope: string
  command: string
  folder: unknown
  sort: number
  permission: Permission3
  flags: unknown
}

export interface Permission3 {
  default: number
}

export interface ExportSource {
  world: string
  system: string
  coreVersion: string
  systemVersion: string
}

export interface Core3 {
  sourceId: string
}

export interface Enhancedcombathud2 {
  set1p: boolean
  set2p: boolean
  set3p: boolean
}

export interface BetterRolls5e3 {
  quickDamage?: QuickDamage2
  quickOther?: QuickOther2
  quickDesc?: QuickDesc2
  quickAttack?: QuickAttack2
  quickSave?: QuickSave2
  quickProperties?: QuickProperties2
  quickFlavor?: QuickFlavor2
  quickCharges: QuickCharges3
}

export interface QuickDamage2 {
  context: Context2
  value: Value4
  altValue: AltValue4
}

export interface Context2 {
  "0": string
}

export interface Value4 {
  "0": boolean
}

export interface AltValue4 {
  "0": boolean
}

export interface QuickOther2 {
  context: string
  value: boolean
  altValue: boolean
}

export interface QuickDesc2 {
  value: boolean
  altValue: boolean
}

export interface QuickAttack2 {
  value: boolean
  altValue: boolean
}

export interface QuickSave2 {
  value: boolean
  altValue: boolean
}

export interface QuickProperties2 {
  value: boolean
  altValue: boolean
}

export interface QuickFlavor2 {
  value: boolean
  altValue: boolean
}

export interface QuickCharges3 {
  value: Value5
  altValue: AltValue5
}

export interface Value5 {
  quantity?: boolean
  use: boolean
  resource?: boolean
}

export interface AltValue5 {
  quantity?: boolean
  use: boolean
  resource?: boolean
}

export interface Magicitems3 {
  enabled: boolean
  equipped?: boolean
  attuned?: boolean
  charges?: string
  chargeType?: string
  destroy?: boolean
  destroyFlavorText?: string
  rechargeable?: boolean
  recharge?: string
  rechargeType?: string
  rechargeUnit?: string
  sorting?: string
  destroyCheck?: string
  spells?: unknown
  feats?: unknown
  tables?: unknown
}

export interface Ddbimporter3 {
  dndbeyond: Dndbeyond3
  id: number
  entityTypeId: number
  containerEntityId?: number
  containerEntityTypeId?: number
  definitionEntityTypeId: number
  definitionId: number
  originalName: string
  version: string
  importId?: string
}

export interface Dndbeyond3 {
  type: string
  tags: string[]
  sources: Source2[]
  stackable: boolean
  filterType?: string
}

export interface Source2 {
  sourceId: number
  pageNumber: number
  sourceType: number
}

export interface Infusions3 {
  maps: unknown[]
  applied: unknown[]
  infused: boolean
}

export interface ScenePacker {
  hash: string
}

export interface SpellTemplateManager {
  stmData: StmData
}

export interface StmData {
  ignoreDuration: boolean
  spellTexture: string
  useTexture: boolean
  alpha: number
  coneOrigin: number
  loopAnimations: boolean
}

export interface Polyglot {
  language: string
}

export interface Dnd5eHelpers {
  coverMessage: boolean
  tokenUuid: string
}

export interface ItemPiles {
  publicTradeId: string
  tradeUsers: string[]
}

export interface Pf2e {
  context?: Context3
  unsafe?: string
  modifierName?: string
  modifiers?: Modifier[]
  origin?: Origin
  strike?: Strike
  casting?: Casting
  isFromConsumable?: boolean
  damageRoll?: DamageRoll
  target?: Target5
  preformatted?: string
  spellVariant?: SpellVariant
  journalEntry?: string
  canReroll?: boolean
}

export interface Context3 {
  actor?: string
  domains?: string[]
  target?: Target4
  dc?: Dc
  notes?: Note[]
  options?: string[]
  type: string
  rollMode?: string
  skipDialog?: boolean
  rollTwice: unknown
  substitutions?: Substitution[]
  dosAdjustments?: unknown
  traits?: Trait[]
  createMessage?: boolean
  token?: string
  title?: string
  isReroll?: boolean
  outcome?: string
  unadjustedOutcome?: string
  secret?: boolean
  altUsage?: string
}

export interface Target4 {
  actor: string
  token: string
}

export interface Dc {
  scope?: string
  slug?: string
  value: number
  adjustments?: Adjustment[]
  label?: string
  visibility?: string
}

export interface Adjustment {
  modifiers: Modifiers
  predicate: unknown
}

export interface Modifiers {
  success: string
}

export interface Note {
  selector: string
  title?: string
  text: string
  predicate: unknown
  outcome: string[]
  visibility?: string
}

export interface Substitution {
  slug: string
  label: string
  value: number
  predicate?: unknown[]
  ignored: boolean
  effectType: string
}

export interface Trait {
  name: string
  label: string
  description?: string
  rollName?: string
  rollOption?: string
}

export interface Modifier {
  label: string
  slug?: string
  modifier: number
  type: string
  ability?: string
  force?: boolean
  adjustments: Adjustment2[]
  enabled: boolean
  ignored?: boolean
  custom?: boolean
  source?: string
  predicate: unknown
  notes?: string
  traits?: unknown[]
  hideIfDisabled?: boolean
  damageType: unknown
  damageCategory: unknown
  critical: unknown
  kind?: string
}

export interface Adjustment2 {
  slug?: string
  getNewValue?: unknown
  predicate: unknown
  suppress?: boolean
  getDamageType?: unknown
}

export interface Origin {
  sourceId?: string
  uuid: string
  type: string
}

export interface Strike {
  actor: string
  index: number
  damaging: boolean
  name: string
  altUsage: unknown
}

export interface Casting {
  id: string
  level?: number
  tradition: string
}

export interface DamageRoll {
  outcome: string
  traits: string[]
  types: Types
  total: number
  diceResults: DiceResults
  baseDamageDice: number
  rollMode?: string
}

export interface Types {
  piercing?: Piercing
  bludgeoning?: Bludgeoning
  negative?: Negative
  slashing?: Slashing
  fire?: Fire
  acid?: Acid
  evil?: Evil
  metal?: Metal
  cold?: Cold
}

export interface Piercing {
  physical: number
  precision?: number
}

export interface Bludgeoning {
  physical: number
}

export interface Negative {
  energy: number
}

export interface Slashing {
  physical: number
}

export interface Fire {
  energy: number
}

export interface Acid {
  energy: number
}

export interface Evil {
  alignment: number
}

export interface Metal {
  metal: number
}

export interface Cold {
  energy: number
}

export interface DiceResults {
  piercing?: Piercing2
  bludgeoning?: Bludgeoning2
  negative?: Negative2
  slashing?: Slashing2
  fire?: Fire2
  acid?: Acid2
  evil?: Evil2
  metal?: Metal2
  cold?: Cold2
}

export interface Piercing2 {
  physical: unknown[]
  precision?: unknown[]
}

export interface Bludgeoning2 {
  physical: unknown[]
}

export interface Negative2 {
  energy: number[]
}

export interface Slashing2 {
  physical: unknown[]
}

export interface Fire2 {
  energy: number[]
}

export interface Acid2 {
  energy: unknown[]
}

export interface Evil2 {
  alignment: number[]
}

export interface Metal2 {
  metal: number[]
}

export interface Cold2 {
  energy: number[]
}

export interface Target5 {
  actor: string
  token: string
}

export interface SpellVariant {
  overlayIds: string[]
}

export interface Pf2eTargetDamage {
  targets: Target6[]
}

export interface Target6 {
  id: string
  name: string
  uuid: string
  img: string
  hasPlayerOwner: boolean
  playersCanSeeName: boolean
}

export interface Pf2eDorakoUi {
  userAvatar: UserAvatar
  combatantAvatar: unknown
  tokenAvatar?: TokenAvatar
  actorAvatar?: ActorAvatar
  wasTokenHidden?: boolean
}

export interface UserAvatar {
  name?: string
  image?: string
  type: string
}

export interface TokenAvatar {
  name?: string
  image: string
  type: string
  scale: number
  isSmall: boolean
}

export interface ActorAvatar {
  name?: string
  image: string
  type: string
}

export interface Persistent {
  damageType: string
  dc: number
  value: string
}

export interface MonksTokenbar {
  xp: number
  reason: string
  actors: Actor[]
}

export interface Actor {
  id: string
  icon: string
  name: string
  xp: number
  assigned: boolean
}

export interface Pf2eRangedCombat {
  actorId: string
}

export interface Pf2eJb2Amacros {
  spellLevel: string
}

export interface Pf2eDorakoUi2 {
  userAvatar: UserAvatar2
  combatantAvatar: unknown
  tokenAvatar: unknown
  actorAvatar: unknown
}

export interface UserAvatar2 {
  type: string
}

export interface Lootsheetnpc5e {
  loot: Loot[]
  lootId: string
}

export interface Loot {
  quantity: number
  priceTotal: string
  data: Data5
}

export interface Data5 {
  img: string
  name: string
  price: string
  rarity: string
  documentName?: string
  id?: string
  uuid?: string
}

export interface Smartdoors {
  source: Source3
}

export interface Source3 {
  wall: string
  scene: string
}

