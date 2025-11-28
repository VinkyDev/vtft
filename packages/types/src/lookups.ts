export interface Lookups {
  /** 物品 */
  items?: Item[]
  /** 单位(英雄) */
  units?: LookupsUnit[]
  /** 符文强化 */
  augments?: AugmentClass[]
  /** 羁绊 */
  traits?: Trait[]
  /** 衍生装备 */
  armory_items?: ArmoryItem[]
  /** 城邦 */
  encounters?: { [key: string]: Encounter }
  /** 英雄定位 */
  roles?: { [key: string]: Role }
}

export interface ArmoryItem {
  apiName?: string
  desc?: string
  effects?: { [key: string]: number }
  from?: null
  icon?: string
  id?: null
  name?: string
  unique?: boolean
  en_name?: string
  variable_matches?: VariableMatch[]
}

export interface VariableMatch {
  match?: string
  type?: VariableMatchType
  full_match?: string
  hash?: string
  value?: number | null
  multiplier?: string
  level?: string
}

export enum VariableMatchType {
  Multiplier = 'multiplier',
  Variable = 'variable',
}

export enum AugmentEnum {
  Tier1 = 'Tier1',
  Tier2 = 'Tier2',
  Tier3 = 'Tier3',
}

export interface AugmentClass {
  /** 符文强化Id */
  apiName?: string
  /** 符文强化关联的羁绊 */
  associatedTraits?: string[]
  /** 符文强化描述 */
  desc?: string
  /** 符文强化效果 */
  effects?: { [key: string]: number | null }
  icon?: string
  /** 符文强化名称(中文) */
  name?: string
  /** 符文强化标签 */
  tags?: AugmentTag[]
  /** 是否为唯一强化 */
  unique?: boolean
  /** 符文强化名称(英文) */
  en_name?: string
  /** 符文强化变量匹配 */
  variable_matches?: VariableMatch[]
  /** 符文强化类型 */
  type?: AugmentType
  /** 符文强化贴图 */
  texture?: string
  /** 是否为禁用强化 */
  disabled?: boolean
}

export type AugmentTag = '2-1' | '3-2' | '4-2' | string

export type AugmentType = 'regular' | string

export interface Encounter {
  ChampionSkin?: string
  EncounterRulesText?: string
  apiName?: string
  stages?: number[]
  hyperStages?: number[]
  tags?: EncounterTag[]
  name?: string
}

export enum EncounterTag {
  Cc9Fe568 = '{cc9fe568}',
  E6512306 = '{e6512306}',
  F2196170 = '{f2196170}',
  The42A85B31 = '{42a85b31}',
  The5B754253 = '{5b754253}',
}

export interface Item {
  /** 物品 API 名称 (Id) */
  apiName?: string
  /** 物品关联的羁绊 */
  associatedTraits?: string[]
  /** 物品合成 */
  composition?: Composition[]
  /** 物品描述 */
  desc?: string
  effects?: { [key: string]: number | null }
  icon?: string
  incompatibleTraits?: string[]
  /** 物品名称 (中文) */
  name?: string
  /** 物品标签 */
  tags?: ItemTag[]
  /** 物品是否唯一 */
  unique?: boolean
  /** 物品名称 (英文) */
  en_name?: string
  /** 物品是否已禁用 */
  disabled?: boolean
  /** 物品变量匹配 */
  variable_matches?: VariableMatch[]
}

// 物品合成 基础装备
export enum Composition {
  TFTItemBFSword = 'TFT_Item_BFSword',
  TFTItemChainVest = 'TFT_Item_ChainVest',
  TFTItemFryingPan = 'TFT_Item_FryingPan',
  TFTItemGiantsBelt = 'TFT_Item_GiantsBelt',
  TFTItemNeedlesslyLargeRod = 'TFT_Item_NeedlesslyLargeRod',
  TFTItemNegatronCloak = 'TFT_Item_NegatronCloak',
  TFTItemRecurveBow = 'TFT_Item_RecurveBow',
  TFTItemSparringGloves = 'TFT_Item_SparringGloves',
  TFTItemSpatula = 'TFT_Item_Spatula',
  TFTItemTearOfTheGoddess = 'TFT_Item_TearOfTheGoddess',
}

export enum ItemTag {
  Artifact = 'Artifact', // 物品标签: 神器
  Consumable = 'Consumable', // 物品标签: 消耗品
  Emblem = 'Emblem', // 物品标签: 徽章
  Support = 'Support', // 物品标签: 辅助装
}

export interface Role {
  apiName?: string
  items?: string[]
  name?: string
  description?: string
}

export interface Trait {
  /** 羁绊 API 名称 (Id) */
  apiName?: string
  /** 羁绊描述 */
  desc?: string
  /** 羁绊效果 */
  effects?: Effect[]
  icon?: string
  /** 羁绊名称 (中文) */
  name?: string
  /** 羁绊关联的单位 */
  units?: TraitUnit[]
  /** 羁绊名称 (英文) */
  en_name?: string
  /** 基础效果 */
  baseEffects?: { [key: string]: number }
}

export interface Effect {
  maxUnits?: number
  minUnits?: number
  style?: number // 1青铜 3白银 4独特 5黄金 6棱彩
  variables?: { [key: string]: number | null }
  variable_matches?: VariableMatch[]
}

export interface TraitUnit {
  unit?: string
  unit_cost?: number
}

export interface LookupsUnit {
  /** 单位技能 */
  ability?: Ability
  /** 单位属性 */
  apiName?: string
  /** 单位名称 (英文) */
  characterName?: string
  /** 费用 */
  cost?: number
  icon?: null | string
  /** 单位名称 (中文) */
  name?: string
  /** 定位 */
  role?: null | string
  squareIcon?: null | string
  /** 基础属性 */
  stats?: Stats
  tileIcon?: string
  /** 单位羁绊 */
  traits?: string[]
  en_name?: string
  code?: string
}

export interface Ability {
  desc?: string
  icon?: null | string
  name?: string
  variables?: Variable[]
  tooltipElements?: AbilityTooltipElement[]
  calculations?: AbilityCalculations
}

export interface AbilityCalculations {
  'TotalDamage'?: ModifiedSplashDamageElement[]
  'TotalHealing'?: ModifiedHealElement[]
  'ModifiedDamage'?: ModifiedHealElement[]
  'ModifiedSecondaryDamage'?: AdDamagePerArrowDisplayOnly[]
  'Total_Dash_Damage'?: ModifiedHealElement[]
  'Total_Strike_Damage'?: ModifiedHealElement[]
  'TotalArrows'?: TotalArrow[]
  'ArrowAPDamageDisplayOnly'?: AdDamagePerArrowDisplayOnly[]
  'ADDamagePerArrowDisplayOnly'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAOEDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedThrowDamage'?: ModifiedHealElement[]
  'ExecuteThreshold'?: ExecuteThreshold[]
  'ModifiedPrimaryDamage'?: ModifiedPrimaryDamage[]
  'ModifiedNumBounces'?: ModifiedBonusAd[]
  'ModifiedHeal'?: ModifiedHealElement[]
  'ModifiedADDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAPDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedBonusAD'?: ModifiedBonusAd[]
  '{157063a4}'?: ModifiedBonusAd[]
  'ModifiedUltimateBarrageADDamage'?: ModifiedHealElement[]
  'ModifiedUltimateBarrageAPDamage'?: AdDamagePerArrowDisplayOnly[]
  'AdditionalDamage'?: AdditionalDamage[]
  'ModifiedHealthGain'?: ModifiedHealthGainElement[]
  'ModifiedConeDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedNeedleDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedBurstDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedDividedDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedConeSplitDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAllyShield'?: ModifiedAdditionalDamageElement[]
  'DamageTotal'?: DamageTotal[]
  'ModifiedShield'?: ModifiedHealElement[]
  'ModifiedNumSparks'?: ModifiedBonusAd[]
  'ModifiedSparkDamage'?: ModifiedHealElement[]
  'ModifiedASPerStack'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedRocketAOEDamage'?: AdDamagePerArrowDisplayOnly[]
  'ASPerCrit'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedMaxAS'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedDurability'?: ModifiedAttackSpeedElement[]
  'ModifiedTankDamage'?: FinalAttackDamage[]
  'ModifiedFighterDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAD'?: ModifiedAD[]
  'ModifiedAS'?: ExecuteThreshold[]
  'BattleBonusBlinkDamage'?: BattleBonusBlinkDamage[]
  'ModifiedUltimateMagicDamage'?: ModifiedHealElement[]
  'AscensionModifiedMagicDamage'?: AdDamagePerArrowDisplayOnly[]
  'TotalShield'?: ModifiedHealElement[]
  '{51873b7f}'?: ModifiedHealElement[]
  '{c9683efc}'?: ModifiedHealElement[]
  '{551c31f1}'?: ModifiedHealElement[]
  '{d0012fce}'?: ModifiedHealElement[]
  '{9f9650f3}'?: ModifiedHealElement[]
  'ModifiedSunburstDamage'?: FinalAttackDamage[]
  'ModifiedResistSteal'?: ModifiedBonusAd[]
  'ModifiedBaseDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedResists'?: AdDamagePerArrowDisplayOnly[]
  'FinalShield'?: AdDamagePerArrowDisplayOnly[]
  'SecondaryDamage'?: SecondaryDamage[]
  'MaxStunDuration'?: MaxStunDuration[]
  'ModifiedPotentialHeal'?: ModifiedHealthGainElement[]
  'ModifiedUltimateHeal'?: ModifiedAdditionalDamageElement[]
  'ModifiedFlatDamageReduction'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAdditionalDamage'?: ModifiedAdditionalDamageElement[]
  'ModifiedQBulletDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedCastRange'?: ModifiedCastRange[]
  'ModifiedFlurryDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedTrueDamage'?: ModifiedTrueDamage[]
  'ModifiedInitialHealth'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedHealing'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedRange'?: ModifiedRange[]
  'TotalArrowDamage'?: ModifiedHealElement[]
  'ModifiedArrowsPerSecond'?: ModifiedArrowsPerSecond[]
  'ModifiedPassiveDamage'?: ModifiedHealElement[]
  'ModifiedComboDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedFinalComboDamage'?: AdDamagePerArrowDisplayOnly[]
  'CurrentAutoDamage'?: CurrentAutoDamage[]
  'FinalAttackSpeed'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedStrikeDamage'?: ModifiedHealElement[]
  'ModifiedAttackTrueDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedAttackMagicDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedNumPages'?: ModifiedHealthGainElement[]
  'ModifiedMagicPageDamage'?: ModifiedMagicPageDamage[]
  'FinalDamage'?: AdDamagePerArrowDisplayOnly[]
  'TotalAttackDamage'?: TotalAttackDamageElement[]
  'ModifiedExplosionDamage'?: AdDamagePerArrowDisplayOnly[]
  'CurrentAutoValue'?: CurrentAutoDamage[]
  'ModifiedAttackSpeed'?: ModifiedAttackSpeedElement[]
  'SlamDamage'?: ModifiedHealElement[]
  'ModifiedOmnivamp'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedExtraProjectileDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedEmberDamage'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedGoldChance'?: ModifiedAdditionalDamageElement[]
  'TotalHeal'?: ModifiedHealElement[]
  'MaxAS'?: AdDamagePerArrowDisplayOnly[]
  '{90b31848}'?: ModifiedHealElement[]
  'ModifiedSpell1Damage'?: ModifiedHealElement[]
  'ModifiedSpell2Damage'?: ModifiedHealElement[]
  'ModifiedSpell2SecondaryDamage'?: ModifiedHealElement[]
  'ModifiedSpell3Damage'?: ModifiedHealElement[]
  'ModifiedSpell3SecondaryDamage'?: ModifiedHealElement[]
  'ModifiedCoreEnergyShield'?: AdDamagePerArrowDisplayOnly[]
  'ModifiedSpell4LandingDamage'?: ModifiedHealElement[]
  'ModifiedMagicDamage'?: AdDamagePerArrowDisplayOnly[]
  'TotalShieldValue'?: ModifiedHealElement[]
  'ModifiedLeapHealth'?: AdDamagePerArrowDisplayOnly[]
  'FinalAttackDamage'?: FinalAttackDamage[]
}

export interface AdDamagePerArrowDisplayOnly {
  mRatio?: number
  mStat?: number
  type?: TypeEnum
  part?: TotalArrow
  mStyleTagIfScaled?: string
  name?: string
  displayAsPercent?: boolean
  value?: Value
  mStyleTag?: string
  mBuffName?: MBuffName
  mStatFormula?: number
}

export enum MBuffName {
  E7B3Aa56 = '{e7b3aa56}',
  The6Beaf38D = '{6beaf38d}',
  The882C17D2 = '{882c17d2}',
}

export interface TotalArrow {
  name?: string
  type?: TypeEnum
}

export enum TypeEnum {
  BuffCounterByNamedDataValueCalculationPart = 'BuffCounterByNamedDataValueCalculationPart',
  Multiplier = 'multiplier',
  NamedDataValueCalculationPart = 'NamedDataValueCalculationPart',
  StatByNamedDataValueCalculationPart = 'StatByNamedDataValueCalculationPart',
  StatBySubPartCalculationPart = 'StatBySubPartCalculationPart',
  SubPartScaledProportionalToStat = 'SubPartScaledProportionalToStat',
  SumOfSubPartsCalculationPart = 'SumOfSubPartsCalculationPart',
}

export interface Value {
  name?: string
  type?: string
  mNumber?: number
}

export interface AdditionalDamage {
  type?: TypeEnum
  parts?: AdditionalDamagePart[]
}

export interface AdditionalDamagePart {
  mStat?: number
  name?: string
  type?: TypeEnum
  mRatio?: number
  part?: TotalArrow
}

export interface BattleBonusBlinkDamage {
  type?: BattleBonusBlinkDamageType
  part1?: ModifiedBonusAd
  part2?: Part2Class
}

export interface ModifiedBonusAd {
  mBuffName?: MBuffName
  name?: string
  type?: ModifiedBonusADType
  mIconKey?: string
  mCoefficient?: number
  mStat?: number
}

export enum ModifiedBonusADType {
  BuffCounterByCoefficientCalculationPart = 'BuffCounterByCoefficientCalculationPart',
  BuffCounterByNamedDataValueCalculationPart = 'BuffCounterByNamedDataValueCalculationPart',
  NamedDataValueCalculationPart = 'NamedDataValueCalculationPart',
  StatByCoefficientCalculationPart = 'StatByCoefficientCalculationPart',
}

export interface Part2Class {
  mSpellCalculationKey?: string
  type?: string
}

export enum BattleBonusBlinkDamageType {
  ProductOfSubPartsCalculationPart = 'ProductOfSubPartsCalculationPart',
  SumOfSubPartsCalculationPart = 'SumOfSubPartsCalculationPart',
}

export interface CurrentAutoDamage {
  mStat?: number
  mCoefficient?: number
  type?: ModifiedBonusADType
  mStatFormula?: number
  displayAsPercent?: boolean
}

export interface DamageTotal {
  type?: BattleBonusBlinkDamageType
  part1?: Part2Class
  part2?: TotalArrow
}

export interface ExecuteThreshold {
  displayAsPercent?: boolean
  type?: TypeEnum
  parts?: AdDamagePerArrowDisplayOnly[]
}

export interface FinalAttackDamage {
  type?: TypeEnum
  parts?: ModifiedPassiveDamage[]
}

export interface ModifiedPassiveDamage {
  mStat?: number
  name?: string
  type?: TypeEnum
}

export interface MaxStunDuration {
  type?: string
  part1?: TotalArrow
  part2?: TotalArrow
  name?: string
}

export interface ModifiedAD {
  type?: BattleBonusBlinkDamageType
  part1?: FinalAttackDamage
  part2?: TotalArrow
}

export interface ModifiedAdditionalDamageElement {
  type?: TypeEnum
  parts?: AdDamagePerArrowDisplayOnly[]
}

export interface ModifiedArrowsPerSecond {
  type?: TypeEnum
  parts?: ModifiedArrowsPerSecondModifiedDamage[]
}

export interface ModifiedArrowsPerSecondModifiedDamage {
  mStat?: number
  name?: string
  type?: TypeEnum
  mStatFormula?: number
}

export interface ModifiedAttackSpeedElement {
  displayAsPercent?: boolean
  name?: string
  type?: string
  mBonusStatForEfficiency?: number
}

export interface ModifiedCastRange {
  type?: string
  parts?: ModifiedHeal[]
  mNumber?: number
}

export interface ModifiedHeal {
  mStat?: number
  mCoefficient?: number
  type?: string
  mNumber?: number
  name?: string
}

export interface ModifiedHealElement {
  mRatio?: number
  type?: TypeEnum
  part?: TotalArrow
  mStat?: number
  parts?: AdditionalDamagePart[]
  name?: string
  mStyleTag?: string
  mStyleTagIfScaled?: string
  value?: ModifiedBonusAd
}

export interface ModifiedHealthGainElement {
  type?: TypeEnum
  parts?: ModifiedBonusAd[]
}

export interface ModifiedMagicPageDamage {
  type?: BattleBonusBlinkDamageType
  part1?: Part2Class
  part2?: ModifiedBonusAd
}

export interface ModifiedPrimaryDamage {
  type?: TypeEnum
  parts?: TotalArrow[]
}

export interface ModifiedRange {
  type?: TypeEnum
  parts?: ModifiedHeal[]
}

export interface ModifiedTrueDamage {
  type?: TypeEnum
  parts?: ModifiedTrueDamagePart[]
}

export interface ModifiedTrueDamagePart {
  type?: string
  part1?: TotalArrow
  part2?: PurplePart2
  name?: string
}

export interface PurplePart2 {
  mCoefficient?: number
  mAbilityResource?: number
  type?: string
}

export interface SecondaryDamage {
  type?: string
  parts?: ModifiedHealElement[]
  mSpellCalculationKey?: string
  value?: TotalArrow
}

export interface TotalAttackDamageElement {
  type?: TypeEnum
  parts?: TotalAttackDamagePart[]
}

export interface TotalAttackDamagePart {
  mStat?: number
  type?: TypeEnum
  part?: TotalArrow
  mRatio?: number
}

export interface ModifiedSplashDamageElement {
  type?: BattleBonusBlinkDamageType
  parts?: AdDamagePerArrowDisplayOnly[]
  part1?: Part2Class
  part2?: Part2Class
}

export interface AbilityTooltipElement {
  type?: string
  nameOverride?: string
  name?: string
  Style?: number
  multiplier?: number
  typeIndex?: number
}

export interface Variable {
  name?: string
  value?: number[]
}

export interface ModifiedCoreEnergyShield {
  mRatio?: number
  type?: TypeEnum
  part?: TotalArrow
}

export interface ModifiedNumClone {
  type?: TypeEnum
  parts?: ModifiedNumClonePart[]
}

export interface ModifiedNumClonePart {
  type?: string
  part1?: PartPart1
  part2?: FluffyPart2
  name?: string
}

export interface PartPart1 {
  part1?: Part1Part1
  part2?: Part1Part2
  type?: string
}

export interface Part1Part1 {
  mDataValue?: string
  __type?: TypeEnum
}

export interface Part1Part2 {
  mNumber?: number
  __type?: string
}

export interface FluffyPart2 {
  mCeiling?: number
  type?: string
  parts?: CurrentAutoDamage[]
}

export interface Stats {
  armor?: number | null
  attackSpeed?: number | null
  critChance?: number | null
  critMultiplier?: number
  damage?: number | null
  hp?: number | null
  initialMana?: number
  magicResist?: number | null
  mana?: number
  range?: number
}
