// To parse this data:
//
//   import { Convert, Lookups, CompsStats, CompsDetails, CompsData } from "./file";
//
//   const lookups = Convert.toLookups(json);
//   const compsStats = Convert.toCompsStats(json);
//   const compsDetails = Convert.toCompsDetails(json);
//   const compsData = Convert.toCompsData(json);

export interface Lookups {
    items?:             Item[];
    units?:             LookupsUnit[];
    augments?:          LookupsAugment[];
    traits?:            LookupsTrait[];
    armory_items?:      ArmoryItem[];
    augmentOdds?:       AugmentOdd[];
    portals?:           any[];
    encounters?:        { [key: string]: Encounter };
    roles?:             { [key: string]: Role };
    extraTranslations?: ExtraTranslations;
    augmentCategories?: AugmentCategories;
    zaps?:              any[];
}

export interface ArmoryItem {
    apiName?:            string;
    associatedTraits?:   any[];
    composition?:        any[];
    desc?:               string;
    effects?:            { [key: string]: number };
    from?:               null;
    icon?:               string;
    id?:                 null;
    incompatibleTraits?: any[];
    name?:               string;
    tags?:               any[];
    unique?:             boolean;
    en_name?:            string;
    variable_matches?:   VariableMatch[];
}

export interface VariableMatch {
    match?:      string;
    type?:       VariableMatchType;
    full_match?: string;
    hash?:       string;
    value?:      number | null;
    multiplier?: string;
    level?:      string;
}

export enum VariableMatchType {
    Multiplier = "multiplier",
    Variable = "variable",
}

export interface AugmentCategories {
}

export interface AugmentOdd {
    odds?:     number;
    augments?: AugmentEnum[];
}

export enum AugmentEnum {
    Tier1 = "Tier1",
    Tier2 = "Tier2",
    Tier3 = "Tier3",
}

export interface LookupsAugment {
    apiName?:            string;
    associatedTraits?:   string[];
    composition?:        any[];
    desc?:               string;
    effects?:            { [key: string]: number | null };
    from?:               null;
    icon?:               string;
    id?:                 null;
    incompatibleTraits?: string[];
    name?:               string;
    tags?:               AugmentTag[];
    unique?:             boolean;
    en_name?:            string;
    variable_matches?:   VariableMatch[];
    type?:               AugmentType;
    texture?:            string;
    disabled?:           boolean;
}

export enum AugmentTag {
    B72Bd3Bf = "{b72bd3bf}",
    Ce1Fd21C = "{ce1fd21c}",
    Cf1Fd3AF = "{cf1fd3af}",
    D02Ae323 = "{d02ae323}",
    D11Fd6D5 = "{d11fd6d5}",
    D12Ae4B6 = "{d12ae4b6}",
    D22Ae649 = "{d22ae649}",
    D79Fb940 = "{d79fb940}",
    Ec068228 = "{ec068228}",
    The21 = "2-1",
    The32 = "3-2",
    The3754D0AE = "{3754d0ae}",
    The37Baee9B = "{37baee9b}",
    The38Baf02E = "{38baf02e}",
    The39Baf1C1 = "{39baf1c1}",
    The3Ea7328B = "{3ea7328b}",
    The42 = "4-2",
    The4529Fead = "{4529fead}",
    The758Ad473 = "{758ad473}",
    The7Aaa3B47 = "{7aaa3b47}",
    The84A6D904 = "{84a6d904}",
    The8Fba48A3 = "{8fba48a3}",
    The92E7310E = "{92e7310e}",
}

export enum AugmentType {
    Regular = "regular",
}

export interface Encounter {
    ChampionSkin?:       string;
    EncounterRulesText?: string;
    apiName?:            string;
    stages?:             number[];
    hyperStages?:        number[];
    tags?:               EncounterTag[];
    name?:               string;
}

export enum EncounterTag {
    Cc9Fe568 = "{cc9fe568}",
    E6512306 = "{e6512306}",
    F2196170 = "{f2196170}",
    The42A85B31 = "{42a85b31}",
    The5B754253 = "{5b754253}",
}

export interface ExtraTranslations {
    TFT15_RogueCaptain_Bounty_TheCrew_GainADAP?:          string;
    TFT15_RogueCaptain_Bounty_CompletedItemAnvil?:        string;
    TFT15_RogueCaptain_Bounty_TheCrew_ShipReinforcement?: string;
    TFT15_RogueCaptain_Bounty_ArtifactAnvil?:             string;
    TFT15_RogueCaptain_Bounty_GainGoldLarge?:             string;
    TFT15_RogueCaptain_Bounty_Random5Cost?:               string;
    TFT15_RogueCaptain_Bounty_TankEmpower?:               string;
    TFT15_RogueCaptain_Bounty_TheCrew_GainHealth?:        string;
    TFT15_RogueCaptain_Bounty_All5Cost?:                  string;
    TFT15_RogueCaptain_Bounty_GainAttackSpeed?:           string;
    TFT15_RogueCaptain_Bounty_GainXP?:                    string;
    TFT15_RogueCaptain_Bounty_ThinkFast?:                 string;
    TFT15_RogueCaptain_Bounty_CasterEmpower?:             string;
    TFT15_RogueCaptain_Bounty_TemporaryItem?:             string;
    TFT15_RogueCaptain_Bounty_Random4Cost?:               string;
    TFT15_RogueCaptain_Bounty_GainGoldMedium?:            string;
    TFT15_RogueCaptain_Bounty_TheCrew_RocketUpgrade?:     string;
    TFT15_RogueCaptain_Bounty_LesserDuplicator?:          string;
    TFT15_RogueCaptain_Bounty_GainGold?:                  string;
    TFT15_RogueCaptain_Bounty_All4Cost?:                  string;
    TFT15_RogueCaptain_Bounty_PermanentAP?:               string;
    TFT15_RogueCaptain_Bounty_TheCrew_3Star?:             string;
    TFT15_RogueCaptain_Bounty_TeamShield?:                string;
    TFT15_RogueCaptain_Bounty_TheCrew_GoldPerStar?:       string;
    TFT15_RogueCaptain_Bounty_FreeRerolls?:               string;
}

export interface Item {
    apiName?:            string;
    associatedTraits?:   AssociatedTrait[];
    composition?:        Composition[];
    desc?:               string;
    effects?:            { [key: string]: number | null };
    from?:               null;
    icon?:               string;
    id?:                 null;
    incompatibleTraits?: string[];
    name?:               string;
    tags?:               ItemTag[];
    unique?:             boolean;
    en_name?:            string;
    disabled?:           boolean;
    variable_matches?:   VariableMatch[];
}

export enum AssociatedTrait {
    TFT15Duelist = "TFT15_Duelist",
    TFT15Mecha = "TFT15_Mecha",
    TFT16Bilgewater = "TFT16_Bilgewater",
}

export enum Composition {
    TFTItemBFSword = "TFT_Item_BFSword",
    TFTItemChainVest = "TFT_Item_ChainVest",
    TFTItemFryingPan = "TFT_Item_FryingPan",
    TFTItemGiantsBelt = "TFT_Item_GiantsBelt",
    TFTItemNeedlesslyLargeRod = "TFT_Item_NeedlesslyLargeRod",
    TFTItemNegatronCloak = "TFT_Item_NegatronCloak",
    TFTItemRecurveBow = "TFT_Item_RecurveBow",
    TFTItemSparringGloves = "TFT_Item_SparringGloves",
    TFTItemSpatula = "TFT_Item_Spatula",
    TFTItemTearOfTheGoddess = "TFT_Item_TearOfTheGoddess",
}

export enum ItemTag {
    Artifact = "Artifact",
    Consumable = "Consumable",
    D8D00Bcc = "{d8d00bcc}",
    E8Cbf2D4 = "{e8cbf2d4}",
    Emblem = "Emblem",
    Support = "Support",
}

export interface Role {
    apiName?:     string;
    items?:       string[];
    name?:        string;
    description?: string;
}

export interface LookupsTrait {
    apiName?:        string;
    desc?:           string;
    effects?:        Effect[];
    icon?:           string;
    name?:           string;
    units?:          TraitUnit[];
    en_name?:        string;
    set15_mechanic?: TraitSet15Mechanic;
    baseEffects?:    { [key: string]: number };
    unitProperties?: TraitUnitProperties;
}

export interface Effect {
    maxUnits?:         number;
    minUnits?:         number;
    style?:            number;
    variables?:        { [key: string]: number | null };
    variable_matches?: VariableMatch[];
}

export interface TraitSet15Mechanic {
    Weight?:           number;
    AllowMultiple?:    boolean;
    TraitLevel?:       number;
    IsTrait?:          boolean;
    IsPVEAllowed?:     boolean;
    MaxStage?:         number;
    IsStacking?:       boolean;
    IsChampion?:       boolean;
    IsCommon?:         boolean;
    IsWeird?:          boolean;
    MinLevel?:         number;
    MinStage?:         number;
    IsDuo?:            boolean;
    MaxLevel?:         number;
    IsSecondPowerUp?:  boolean;
    IsRole?:           boolean;
    InvalidChampions?: string[];
    MinPlayerHealth?:  number;
}

export interface TraitUnitProperties {
    TFT15_MechanicTrait_GoldenEdge_Gold?:      number;
    TFT15_StarGuardian_RellValue?:             number;
    TFT15_StarGuardian_SyndraValue?:           number;
    TFT15_StarGuardian_XayahValue?:            number;
    TFT15_StarGuardian_AhriValue?:             number;
    TFT15_StarGuardian_NeekoValue?:            number;
    TFT15_StarGuardian_PoppyValue?:            number;
    TFT15_StarGuardian_JinxValue?:             number;
    TFT15_StarGuardian_JinxBonusASValue?:      number;
    TFT15_StarGuardian_SeraphineValue?:        number;
    TFT15_MechanicTrait_Weights_NumWeights?:   number;
    TFT15_Trait_RogueCaptain_CurrentBounty?:   string;
    TFT16_XerathUnique_PurchasedCharmDisplay?: string;
    TFT16_Caretaker_NumRerolls?:               number;
    TFT16_Ionia_PathTooltip?:                  string;
}

export interface TraitUnit {
    unit?:      string;
    unit_cost?: number;
}

export interface LookupsUnit {
    ability?:             Ability;
    apiName?:             string;
    characterName?:       string;
    cost?:                number;
    icon?:                null | string;
    name?:                string;
    role?:                null | string;
    squareIcon?:          null | string;
    stats?:               Stats;
    tileIcon?:            string;
    traits?:              string[];
    en_name?:             string;
    set15_mechanic?:      Set15MechanicHeroClass;
    set15_mechanic_hero?: Set15MechanicHeroClass;
    code?:                string;
    unitProperties?:      UnitUnitProperties;
    extraAbilities?:      ExtraAbilities;
    unlock?:              Unlock;
}

export interface Ability {
    desc?:            string;
    icon?:            null | string;
    name?:            string;
    variables?:       Variable[];
    tooltipElements?: AbilityTooltipElement[];
    calculations?:    AbilityCalculations;
}

export interface AbilityCalculations {
    TotalDamage?:                      TotalDamageElement[];
    TotalHealing?:                     AdDamagePerArrowDisplayOnly[];
    ModifiedDamage?:                   ModifiedDamage[];
    ModifiedSecondaryDamage?:          ModifiedSecondaryDamage[];
    Total_Dash_Damage?:                AdDamagePerArrowDisplayOnly[];
    Total_Strike_Damage?:              AdDamagePerArrowDisplayOnly[];
    TotalArrows?:                      TotalArrow[];
    ArrowAPDamageDisplayOnly?:         AdDamagePerArrowDisplayOnly[];
    ADDamagePerArrowDisplayOnly?:      AdDamagePerArrowDisplayOnly[];
    ModifiedAOEDamage?:                AdDamagePerArrowDisplayOnly[];
    ModifiedThrowDamage?:              AdDamagePerArrowDisplayOnly[];
    ExecuteThreshold?:                 ExecuteThreshold[];
    ModifiedPrimaryDamage?:            ModifiedPrimaryDamage[];
    ModifiedNumBounces?:               ModifiedBonusAd[];
    ModifiedHeal?:                     ModifiedHeal[];
    ModifiedADDamage?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedAPDamage?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedBonusAD?:                  ModifiedBonusAd[];
    "{157063a4}"?:                     ModifiedBonusAd[];
    ModifiedUltimateBarrageADDamage?:  AdDamagePerArrowDisplayOnly[];
    ModifiedUltimateBarrageAPDamage?:  AdDamagePerArrowDisplayOnly[];
    AdditionalDamage?:                 AdditionalDamage[];
    ModifiedHealthGain?:               ModifiedHealthGainElement[];
    ModifiedConeDamage?:               AdDamagePerArrowDisplayOnly[];
    ModifiedNeedleDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedBurstDamage?:              AdDamagePerArrowDisplayOnly[];
    ModifiedDividedDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedConeSplitDamage?:          AdDamagePerArrowDisplayOnly[];
    ModifiedAllyShield?:               AdDamagePerArrowDisplayOnly[];
    DamageTotal?:                      DamageTotal[];
    ModifiedShield?:                   AdDamagePerArrowDisplayOnly[];
    ModifiedNumSparks?:                ModifiedNumSpark[];
    ModifiedSparkDamage?:              AdDamagePerArrowDisplayOnly[];
    ModifiedASPerStack?:               AdDamagePerArrowDisplayOnly[];
    ModifiedRocketAOEDamage?:          AdDamagePerArrowDisplayOnly[];
    ASPerCrit?:                        AdDamagePerArrowDisplayOnly[];
    ModifiedMaxAS?:                    AdDamagePerArrowDisplayOnly[];
    ModifiedDurability?:               ModifiedDurability[];
    ModifiedTankDamage?:               BonusPassiveDamage[];
    ModifiedFighterDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedAD?:                       ModifiedAD[];
    ModifiedAS?:                       ExecuteThreshold[];
    BattleBonusBlinkDamage?:           BattleBonusBlinkDamage[];
    ModifiedUltimateMagicDamage?:      AdDamagePerArrowDisplayOnly[];
    AscensionModifiedMagicDamage?:     AdDamagePerArrowDisplayOnly[];
    TotalShield?:                      AdDamagePerArrowDisplayOnly[];
    "{51873b7f}"?:                     AdDamagePerArrowDisplayOnly[];
    "{c9683efc}"?:                     AdDamagePerArrowDisplayOnly[];
    "{551c31f1}"?:                     AdDamagePerArrowDisplayOnly[];
    "{d0012fce}"?:                     AdDamagePerArrowDisplayOnly[];
    "{9f9650f3}"?:                     AdDamagePerArrowDisplayOnly[];
    ModifiedSunburstDamage?:           BonusPassiveDamage[];
    ModifiedResistSteal?:              ModifiedNumSpark[];
    ModifiedBaseDamage?:               AdDamagePerArrowDisplayOnly[];
    ModifiedResists?:                  AdDamagePerArrowDisplayOnly[];
    FinalShield?:                      AdDamagePerArrowDisplayOnly[];
    SecondaryDamage?:                  ModifiedAcidDamageElement[];
    MaxStunDuration?:                  MaxStunDuration[];
    ModifiedPotentialHeal?:            ModifiedHealthGainElement[];
    ModifiedUltimateHeal?:             AdditionalDamage[];
    ModifiedFlatDamageReduction?:      AdDamagePerArrowDisplayOnly[];
    ModifiedAdditionalDamage?:         AdditionalDamage[];
    ModifiedQBulletDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedCastRange?:                ModifiedCastRange[];
    ModifiedFlurryDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedTrueDamage?:               ModifiedTrueDamage[];
    ModifiedInitialHealth?:            AdDamagePerArrowDisplayOnly[];
    ModifiedHealing?:                  AdDamagePerArrowDisplayOnly[];
    ModifiedRange?:                    ModifiedRange[];
    TotalArrowDamage?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedArrowsPerSecond?:          ModifiedArrowsPerSecond[];
    ModifiedPassiveDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedComboDamage?:              AdDamagePerArrowDisplayOnly[];
    ModifiedFinalComboDamage?:         AdDamagePerArrowDisplayOnly[];
    CurrentAutoDamage?:                CurrentAutoDamage[];
    FinalAttackSpeed?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedStrikeDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedAttackTrueDamage?:         AdDamagePerArrowDisplayOnly[];
    ModifiedAttackMagicDamage?:        AdDamagePerArrowDisplayOnly[];
    ModifiedNumPages?:                 ModifiedNumPageElement[];
    ModifiedMagicPageDamage?:          ModifiedMagicPageDamage[];
    FinalDamage?:                      AdDamagePerArrowDisplayOnly[];
    TotalAttackDamage?:                AdditionalDamage[];
    ModifiedExplosionDamage?:          AdDamagePerArrowDisplayOnly[];
    CurrentAutoValue?:                 CurrentAutoDamage[];
    ModifiedAttackSpeed?:              ModifiedAttackSpeed[];
    SlamDamage?:                       AdDamagePerArrowDisplayOnly[];
    ModifiedOmnivamp?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedExtraProjectileDamage?:    AdDamagePerArrowDisplayOnly[];
    ModifiedEmberDamage?:              AdDamagePerArrowDisplayOnly[];
    ModifiedGoldChance?:               AdditionalDamage[];
    TotalHeal?:                        AdDamagePerArrowDisplayOnly[];
    MaxAS?:                            AdDamagePerArrowDisplayOnly[];
    "{90b31848}"?:                     AdDamagePerArrowDisplayOnly[];
    ModifiedSpell1Damage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedSpell2Damage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedSpell2SecondaryDamage?:    AdDamagePerArrowDisplayOnly[];
    ModifiedSpell3Damage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedSpell3SecondaryDamage?:    AdDamagePerArrowDisplayOnly[];
    ModifiedCoreEnergyShield?:         AdDamagePerArrowDisplayOnly[];
    ModifiedSpell4LandingDamage?:      AdDamagePerArrowDisplayOnly[];
    ModifiedMagicDamage?:              AdDamagePerArrowDisplayOnly[];
    TotalShieldValue?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedLeapHealth?:               AdDamagePerArrowDisplayOnly[];
    FinalAttackDamage?:                BonusPassiveDamage[];
    ModifiedDamagePerSecond?:          AdDamagePerArrowDisplayOnly[];
    ModifiedBonusAPDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedDamageReduction?:          AdDamagePerArrowDisplayOnly[];
    ModifiedNumAttacks?:               AdDamagePerArrowDisplayOnly[];
    ModifiedDamage_Q?:                 AdDamagePerArrowDisplayOnly[];
    SmallArrowDamageFinal?:            AdDamagePerArrowDisplayOnly[];
    ModifiedBigCastDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedDamagePerCrystal?:         AdDamagePerArrowDisplayOnly[];
    ModifiedBigCastHeal?:              AdDamagePerArrowDisplayOnly[];
    ModifiedDefenses?:                 AdDamagePerArrowDisplayOnly[];
    ModifiedCloneHealth?:              BonusPassiveDamage[];
    ModifiedHealPercentage?:           AdDamagePerArrowDisplayOnly[];
    ModifiedDivebombDamage?:           AdDamagePerArrowDisplayOnly[];
    ModifiedFireDamagePerSecond?:      AdditionalDamage[];
    ModifiedActiveDamage?:             ModifiedActiveDamage[];
    BonusPassiveDamage?:               BonusPassiveDamage[];
    ReducedModifiedDamage?:            AdDamagePerArrowDisplayOnly[];
    ModifiedPercentOfTargetMaxHealth?: AdDamagePerArrowDisplayOnly[];
    ModifiedSlamDamage?:               ModifiedSlamDamage[];
    ModifiedRockDamage?:               AdditionalDamage[];
    ModifiedMissileDamage?:            ModifiedAcidDamageElement[];
    ModifiedLaserDamagePerSecond?:     AdditionalDamage[];
    ModifiedMissilesPerSecond?:        ModifiedMissilesPerSecond[];
    ModifiedHealPerSecond?:            AdDamagePerArrowDisplayOnly[];
    ModifiedManaPerSec?:               ModifiedActiveDamage[];
    ModifiedThreshold1Damage?:         AdDamagePerArrowDisplayOnly[];
    ModifiedThreshold7Damage?:         AdDamagePerArrowDisplayOnly[];
    ModifiedAcidDamage?:               ModifiedAcidDamageElement[];
    ModifiedBasicAttackADDamage?:      AdDamagePerArrowDisplayOnly[];
    ModifiedBasicAttackAPDamage?:      AdDamagePerArrowDisplayOnly[];
    ModifiedPerTargetDamage?:          AdditionalDamage[];
    ModifiedTakedownAttackSpeed?:      AdDamagePerArrowDisplayOnly[];
    ModifiedAttackDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedMaxDamage?:                AdDamagePerArrowDisplayOnly[];
    ModifiedBasicAttackDamage?:        AdditionalDamage[];
    ModifiedMinDamage?:                AdDamagePerArrowDisplayOnly[];
    FirstCastModifiedDamage?:          AdditionalDamage[];
    SecondCastModifiedDamage?:         ModifiedAcidDamageElement[];
    ThirdCastModifiedDamage?:          ModifiedAcidDamageElement[];
    ModifiedBiteDamage?:               AdditionalDamage[];
    ModifiedBoltDamage?:               AdditionalDamage[];
    "{d678dbfb}"?:                     AdDamagePerArrowDisplayOnly[];
    ModifiedJarvanDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedGarenDamage?:              AdDamagePerArrowDisplayOnly[];
    ModifiedLuxDamage?:                AdDamagePerArrowDisplayOnly[];
    ModifiedDemaciaExecuteThreshold?:  ModifiedDemaciaExecuteThreshold[];
    ModifiedFreljordTrueDamage?:       AdDamagePerArrowDisplayOnly[];
    ModifiedShadowIslesBonusDamage?:   ModifiedShadowIslesBonusDamage[];
    ModifiedZaunTicks?:                ModifiedZaunTick[];
    ModifiedTargetDamage?:             AdDamagePerArrowDisplayOnly[];
    ModifiedSlashDamage?:              AdditionalDamage[];
    ModifiedDashDamage?:               AdDamagePerArrowDisplayOnly[];
    ModifiedHealthSteal?:              AdDamagePerArrowDisplayOnly[];
    ModifiedHealthDrain?:              ModifiedHealthDrain[];
    ModifiedCastSnipTimes?:            ModifiedCastSnipTime[];
    TotalNumberOfSpears?:              ModifiedCastSnipTime[];
    ModifiedNumTargets?:               ModifiedNumTarget[];
    ModifiedStackingDamage?:           AdDamagePerArrowDisplayOnly[];
    BonusMagicDamage?:                 AdDamagePerArrowDisplayOnly[];
    MagicDamage?:                      AdDamagePerArrowDisplayOnly[];
    ModifiedCleaveDamage?:             AdDamagePerArrowDisplayOnly[];
    "{167b6714}"?:                     AdDamagePerArrowDisplayOnly[];
    "{f751aa80}"?:                     AdDamagePerArrowDisplayOnly[];
    TotalDotDamage?:                   TotalDotDamage[];
    ModifiedHandDamage?:               AdDamagePerArrowDisplayOnly[];
    ModifiedBigAOEDamage?:             ModifiedAcidDamageElement[];
    TotalNumShots?:                    PurpleTotalNumShot[];
    ModifiedSelfHeal?:                 AdditionalDamage[];
}

export interface AdDamagePerArrowDisplayOnly {
    mRatio?:            number;
    mStat?:             number;
    type?:              TotalArrowType;
    part?:              TotalArrow;
    mStyleTagIfScaled?: string;
    name?:              string;
    displayAsPercent?:  boolean;
    value?:             Value;
    parts?:             AdDamagePerArrowDisplayOnly[];
    mStyleTag?:         string;
    mBuffName?:         MBuffName;
    mStatFormula?:      number;
}

export enum MBuffName {
    E7B3Aa56 = "{e7b3aa56}",
    The3D91Cbb4 = "{3d91cbb4}",
}

export interface TotalArrow {
    name?: string;
    type?: TotalArrowType;
}

export enum TotalArrowType {
    BuffCounterByNamedDataValueCalculationPart = "BuffCounterByNamedDataValueCalculationPart",
    Multiplier = "multiplier",
    NamedDataValueCalculationPart = "NamedDataValueCalculationPart",
    StatByNamedDataValueCalculationPart = "StatByNamedDataValueCalculationPart",
    StatBySubPartCalculationPart = "StatBySubPartCalculationPart",
    SubPartScaledProportionalToStat = "SubPartScaledProportionalToStat",
    SumOfSubPartsCalculationPart = "SumOfSubPartsCalculationPart",
}

export interface Value {
    name?:         string;
    type?:         string;
    mNumber?:      number;
    mBuffName?:    MBuffName;
    mCoefficient?: number;
}

export interface AdditionalDamage {
    type?:  TotalArrowType;
    parts?: AdDamagePerArrowDisplayOnly[];
}

export interface BattleBonusBlinkDamage {
    type?:  BattleBonusBlinkDamageType;
    part1?: ModifiedBonusAd;
    part2?: Part2Element;
}

export interface ModifiedBonusAd {
    mBuffName?:    MBuffName;
    name?:         string;
    type?:         ModifiedBonusADType;
    mIconKey?:     string;
    mCoefficient?: number;
}

export enum ModifiedBonusADType {
    BuffCounterByCoefficientCalculationPart = "BuffCounterByCoefficientCalculationPart",
    BuffCounterByNamedDataValueCalculationPart = "BuffCounterByNamedDataValueCalculationPart",
    NamedDataValueCalculationPart = "NamedDataValueCalculationPart",
    StatByCoefficientCalculationPart = "StatByCoefficientCalculationPart",
}

export interface Part2Element {
    mSpellCalculationKey?: string;
    type?:                 ModifiedAcidDamageType;
}

export enum ModifiedAcidDamageType {
    F3Cbe7B2 = "{f3cbe7b2}",
    Multiplier = "multiplier",
    SumOfSubPartsCalculationPart = "SumOfSubPartsCalculationPart",
}

export enum BattleBonusBlinkDamageType {
    ProductOfSubPartsCalculationPart = "ProductOfSubPartsCalculationPart",
    SumOfSubPartsCalculationPart = "SumOfSubPartsCalculationPart",
}

export interface BonusPassiveDamage {
    type?:  TotalArrowType;
    parts?: ModifiedPassiveDamage[];
}

export interface ModifiedPassiveDamage {
    mStat?: number;
    name?:  string;
    type?:  TotalArrowType;
}

export interface CurrentAutoDamage {
    mStat?:        number;
    mCoefficient?: number;
    type?:         CurrentAutoDamageType;
    name?:         string;
}

export enum CurrentAutoDamageType {
    NamedDataValueCalculationPart = "NamedDataValueCalculationPart",
    StatByCoefficientCalculationPart = "StatByCoefficientCalculationPart",
    StatByNamedDataValueCalculationPart = "StatByNamedDataValueCalculationPart",
}

export interface DamageTotal {
    type?:  BattleBonusBlinkDamageType;
    part1?: Part2Element;
    part2?: TotalArrow;
}

export interface ExecuteThreshold {
    displayAsPercent?: boolean;
    type?:             TotalArrowType;
    parts?:            AdDamagePerArrowDisplayOnly[];
}

export interface MaxStunDuration {
    type?:  string;
    part1?: TotalArrow;
    part2?: TotalArrow;
    name?:  string;
}

export interface ModifiedAD {
    type?:  BattleBonusBlinkDamageType;
    part1?: BonusPassiveDamage;
    part2?: TotalArrow;
}

export interface ModifiedAcidDamageElement {
    type?:                 ModifiedAcidDamageType;
    parts?:                AdDamagePerArrowDisplayOnly[];
    value?:                TotalArrow;
    mSpellCalculationKey?: string;
}

export interface ModifiedActiveDamage {
    mStat?:            number;
    name?:             string;
    type?:             CurrentAutoDamageType;
    mStatFormula?:     number;
    mCoefficient?:     number;
    displayAsPercent?: boolean;
}

export interface ModifiedArrowsPerSecond {
    type?:  TotalArrowType;
    parts?: ModifiedActiveDamage[];
}

export interface ModifiedAttackSpeed {
    displayAsPercent?: boolean;
    name?:             string;
    type?:             TotalArrowType;
    mRatio?:           number;
    part?:             TotalArrow;
    parts?:            ModifiedAttackSpeedPart[];
    value?:            TotalArrow;
}

export interface ModifiedAttackSpeedPart {
    type?:  string;
    part1?: PurplePart1;
    part2?: TotalArrow;
    name?:  string;
}

export interface PurplePart1 {
    type?:  BattleBonusBlinkDamageType;
    part1?: FluffyPart1;
    part2?: Part1Part2;
}

export interface FluffyPart1 {
    mBuffName?:    MBuffName;
    mIconKey?:     string;
    mCoefficient?: number;
    type?:         ModifiedBonusADType;
}

export interface Part1Part2 {
    part1?: Part2Part1;
    part2?: Part2Part2;
    type?:  FluffyType;
}

export interface Part2Part1 {
    mDataValue?: string;
    __type?:     TotalArrowType;
}

export interface Part2Part2 {
    mNumber?: number;
    __type?:  PurpleType;
}

export enum PurpleType {
    NamedDataValueCalculationPart = "NamedDataValueCalculationPart",
    NumberCalculationPart = "NumberCalculationPart",
    StatByCoefficientCalculationPart = "StatByCoefficientCalculationPart",
}

export enum FluffyType {
    ExponentSubPartsCalculationPart = "ExponentSubPartsCalculationPart",
}

export interface ModifiedCastRange {
    type?:    string;
    parts?:   ModifiedCastRangePart[];
    mNumber?: number;
}

export interface ModifiedCastRangePart {
    mStat?:        number;
    mCoefficient?: number;
    type?:         PurpleType;
    mNumber?:      number;
    name?:         string;
    mStatFormula?: number;
}

export interface ModifiedCastSnipTime {
    type?:  TotalArrowType;
    parts?: ModifiedAttackSpeedPart[];
}

export interface ModifiedDamage {
    mRatio?:            number;
    type?:              TotalArrowType;
    part?:              TotalArrow;
    mStat?:             number;
    parts?:             AdDamagePerArrowDisplayOnly[];
    name?:              string;
    mStyleTag?:         string;
    mStyleTagIfScaled?: string;
    value?:             TotalArrow;
}

export interface ModifiedDemaciaExecuteThreshold {
    displayAsPercent?: boolean;
    type?:             TotalArrowType;
    parts?:            ModifiedDemaciaExecuteThresholdPart[];
}

export interface ModifiedDemaciaExecuteThresholdPart {
    name?:  string;
    type?:  string;
    part1?: ModifiedArrowsPerSecond;
    part2?: PurplePart2;
}

export interface PurplePart2 {
    mNumber?: number;
    type?:    PurpleType;
}

export interface ModifiedDurability {
    mBonusStatForEfficiency?: number;
    displayAsPercent?:        boolean;
    name?:                    string;
    type?:                    string;
}

export interface ModifiedHeal {
    mRatio?:            number;
    type?:              TotalArrowType;
    part?:              TotalArrow;
    mStat?:             number;
    name?:              string;
    parts?:             ModifiedHealPart[];
    mStyleTag?:         string;
    mStyleTagIfScaled?: string;
}

export interface ModifiedHealPart {
    mRatio?: number;
    type?:   string;
    part?:   TotalArrow;
    mStat?:  number;
    name?:   string;
    part1?:  PurplePart1;
    part2?:  TotalArrow;
}

export interface ModifiedHealthDrain {
    type?:  TotalArrowType;
    parts?: ModifiedHealthDrainPart[];
}

export interface ModifiedHealthDrainPart {
    type?:   string;
    part1?:  PurplePart1;
    part2?:  TotalArrow;
    mRatio?: number;
    part?:   TotalArrow;
}

export interface ModifiedHealthGainElement {
    type?:  TotalArrowType;
    parts?: ModifiedHealthGainPart[];
}

export interface ModifiedHealthGainPart {
    name?:      string;
    type?:      TotalArrowType;
    mBuffName?: MBuffName;
}

export interface ModifiedMagicPageDamage {
    type?:  BattleBonusBlinkDamageType;
    part1?: Part2Element;
    part2?: ModifiedBonusAd;
}

export interface ModifiedMissilesPerSecond {
    type?:  TotalArrowType;
    parts?: ModifiedMissilesPerSecondPart[];
}

export interface ModifiedMissilesPerSecondPart {
    type?:  string;
    part1?: TentacledPart1;
    part2?: Part1Part2;
    name?:  string;
}

export interface TentacledPart1 {
    type?:  string;
    parts?: ModifiedCastRangePart[];
}

export interface ModifiedNumPageElement {
    type?:  TotalArrowType;
    parts?: ModifiedNumSpark[];
}

export interface ModifiedNumSpark {
    mBuffName?:    string;
    mIconKey?:     string;
    mCoefficient?: number;
    type?:         ModifiedBonusADType;
    name?:         string;
    mStat?:        number;
    mStatFormula?: number;
}

export interface ModifiedNumTarget {
    type?:  TotalArrowType;
    parts?: ModifiedNumTargetPart[];
}

export interface ModifiedNumTargetPart {
    name?:    string;
    type?:    PurpleType;
    mNumber?: number;
}

export interface ModifiedPrimaryDamage {
    type?:  TotalArrowType;
    parts?: TotalArrow[];
}

export interface ModifiedRange {
    type?:  TotalArrowType;
    parts?: CurrentAutoDamage[];
}

export interface ModifiedSecondaryDamage {
    mRatio?: number;
    type?:   TotalArrowType;
    part?:   TotalArrow;
    mStat?:  number;
    parts?:  AdDamagePerArrowDisplayOnly[];
    value?:  TotalArrow;
}

export interface ModifiedShadowIslesBonusDamage {
    displayAsPercent?: boolean;
    type?:             TotalArrowType;
    parts?:            ModifiedShadowIslesBonusDamagePart[];
}

export interface ModifiedShadowIslesBonusDamagePart {
    type?:  string;
    part1?: PurplePart1;
    part2?: PurplePart2;
    name?:  string;
}

export interface ModifiedSlamDamage {
    type?:  TotalArrowType;
    parts?: AdDamagePerArrowDisplayOnly[];
    value?: TotalArrow;
}

export interface ModifiedTrueDamage {
    type?:  TotalArrowType;
    parts?: ModifiedTrueDamagePart[];
}

export interface ModifiedTrueDamagePart {
    type?:  string;
    part1?: TotalArrow;
    part2?: FluffyPart2;
    name?:  string;
}

export interface FluffyPart2 {
    mCoefficient?:     number;
    mAbilityResource?: number;
    type?:             string;
}

export interface ModifiedZaunTick {
    type?:  TotalArrowType;
    parts?: ModifiedZaunTickPart[];
}

export interface ModifiedZaunTickPart {
    type?:  string;
    part1?: ModifiedMissilesPerSecondPart;
    part2?: TotalArrow;
    name?:  string;
}

export interface TotalDamageElement {
    type?:  BattleBonusBlinkDamageType;
    parts?: AdDamagePerArrowDisplayOnly[];
    part1?: Part2Element;
    part2?: Part2Element;
}

export interface TotalDotDamage {
    type?:  TotalArrowType;
    parts?: Part2Element[];
}

export interface PurpleTotalNumShot {
    type?:  TotalArrowType;
    parts?: PurplePart[];
}

export interface PurplePart {
    type?:  string;
    part1?: ModifiedMissilesPerSecondPart;
    part2?: PurplePart2;
    name?:  string;
}

export interface AbilityTooltipElement {
    type?:         string;
    nameOverride?: string;
    name?:         string;
    multiplier?:   number;
    Style?:        number;
    typeIndex?:    number;
}

export interface Variable {
    name?:  string;
    value?: number[];
}

export interface ExtraAbilities {
    TFT15_GarenSpell_Carry?:          TFT15GarenSpellCarry;
    TFT15_KSanteSpell_Fighter?:       TFT15KSanteSpellFighter;
    TFT15_KennenSpellHero?:           TFT15KennenSpellHero;
    TFT15_KobukoSpell_Transform?:     TFT15KobukoSpellTransform;
    TFT15_LeeSinSpell_ReaperStance?:  TFT15LeeSinSpellReaperStance;
    TFT15_LeeSinSpell_FighterStance?: TFT15LeeSinSpellFighterStance;
    TFT15_LeeSinSpell_TankStance?:    TFT15LeeSinSpellTankStance;
    TFT15_LuluSpell_KogMaw?:          TFT15LuluSpellKogMaw;
    TFT15_LuluSpell_Rammus?:          TFT15LuluSpellRammus;
    TFT15_LuluSpell_Smolder?:         TFT15LuluSpellSmolder;
    TFT15_MalphiteSpellHero?:         TFT15MalphiteSpellHero;
    TFT15_MalzaharSpell_VisualMis?:   TFT15MalzaharSpellVisualMIS;
    TFT15_RyzeSpell_Transform?:       TFT15RyzeSpellTransform;
    TFT15_UdyrSpellHero_Transform?:   TFT15UdyrSpellHeroTransform;
    TFT15_UdyrSpellHero?:             TFT15UdyrSpellHero;
    TFT15_UdyrSpell_Transform?:       TFT15UdyrSpellTransform;
    TFT15_YasuoSpell_Transform?:      TFT15YasuoSpellTransform;
    TFT15_ZacSpellHero?:              TFT15ZacSpellHero;
    TFT15_DrMundoSpellHero?:          TFT15DRMundoSpellHero;
    TFT15_ViSpellHero?:               TFT15ViSpellHero;
    TFT15_Galio_Spell2?:              Tft15GalioSpell;
    TFT15_Galio_Spell3?:              Tft15GalioSpell;
    TFT15_Galio_Spell4?:              Tft15GalioSpell;
    TFT15_ShenSpellHero?:             TFT15ShenSpellHero;
    TFT15_NeekoSpell_Carry?:          TFT15NeekoSpellCarry;
    TFT16_RumbleSpell_Carry?:         TFT16RumbleSpellCarry;
    TFT16_IllaoiSpell_Carry?:         TFT16IllaoiSpellCarry;
    TFT16_ShenSpellCarry?:            Tft16SpellCarry;
    TFT16_ChoGathHeroSpell?:          TFT16ChoGathHeroSpell;
    TFT16_KaisaSpell_AP?:             TFT16KaisaSpellAP;
    TFT16_ViegoSpell_RuinedKing?:     TFT16ViegoSpellRuinedKing;
    TFT16_AtakhanSpellTier3?:         Tft16AtakhanSpellTier;
    TFT16_AtakhanSpellTier2?:         Tft16AtakhanSpellTier;
    TFT16_AtakhanSpellTier1?:         Tft16AtakhanSpellTier;
    TFT16_AtakhanSpellTier4?:         Tft16AtakhanSpellTier;
    TFT16_XinZhaoSpellCarry?:         Tft16SpellCarry;
    TFT16_BlitzcrankSpell_Carry?:     TFT16BlitzcrankSpellCarry;
    TFT16_LucianSpell_Senna?:         TFT16LucianSpellSenna;
}

export interface TFT15DRMundoSpellHero {
    calculations?:    TFT15DRMundoSpellHeroCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15DRMundoSpellHeroCalculations {
    ModifiedChairDamage?:   AdditionalDamage[];
    ModifiedSpellDamage?:   AdditionalDamage[];
    ModifiedSplashPercent?: AdDamagePerArrowDisplayOnly[];
    ModifiedSplashDamage?:  TotalDamageElement[];
    CurrentAutoValue?:      CurrentAutoDamage[];
}

export interface Tft15GalioSpell {
    calculations?:    TFT15GalioSpell2Calculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15GalioSpell2Calculations {
    "{90b31848}"?:                  AdDamagePerArrowDisplayOnly[];
    ModifiedSpell1Damage?:          AdDamagePerArrowDisplayOnly[];
    ModifiedSpell2Damage?:          AdDamagePerArrowDisplayOnly[];
    ModifiedSpell2SecondaryDamage?: AdDamagePerArrowDisplayOnly[];
    ModifiedSpell3Damage?:          AdDamagePerArrowDisplayOnly[];
    ModifiedSpell3SecondaryDamage?: AdDamagePerArrowDisplayOnly[];
    ModifiedCoreEnergyShield?:      AdDamagePerArrowDisplayOnly[];
    ModifiedPassiveDamage?:         ModifiedPassiveDamage[];
    ModifiedSpell4LandingDamage?:   AdDamagePerArrowDisplayOnly[];
}

export interface TFT15GarenSpellCarry {
    calculations?:    TFT15GarenSpellCarryCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15GarenSpellCarryCalculations {
    TotalExecuteThreshold?: AdditionalDamage[];
    AdditionalDamage?:      AdditionalDamage[];
    "{4c6b27b7}"?:          AdditionalDamage[];
    ModifiedHealthGain?:    ModifiedHealthGainElement[];
}

export interface TFT15KSanteSpellFighter {
    calculations?:    TFT15KSanteSpellFighterCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15KSanteSpellFighterCalculations {
    ModifiedDurability?:    ModifiedDurability[];
    ModifiedTankDamage?:    BonusPassiveDamage[];
    ModifiedFighterDamage?: BonusPassiveDamage[];
    ModifiedAD?:            BonusPassiveDamage[];
    ModifiedAS?:            BonusPassiveDamage[];
    ModifiedHeal?:          ModifiedActiveDamage[];
}

export interface TFT15KennenSpellHero {
    calculations?:    TFT15KennenSpellHeroCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15KennenSpellHeroCalculations {
    ModifiedDamage?:        AdDamagePerArrowDisplayOnly[];
    ModifiedPassiveDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15KobukoSpellTransform {
    calculations?:    TFT15KobukoSpellTransformCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15KobukoSpellTransformCalculations {
    TotalShield?:        AdDamagePerArrowDisplayOnly[];
    ModifiedDamage?:     AdDamagePerArrowDisplayOnly[];
    ModifiedLineDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15LeeSinSpellFighterStance {
    calculations?:    TFT15LeeSinSpellFighterStanceCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LeeSinSpellFighterStanceCalculations {
    ModifiedArmorShred?:         AdDamagePerArrowDisplayOnly[];
    ModifiedNumClones?:          ModifiedNumClone[];
    ModifiedCloneDamage?:        AdDamagePerArrowDisplayOnly[];
    ModifiedPassiveCloneDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface ModifiedNumClone {
    type?:  TotalArrowType;
    parts?: ModifiedNumClonePart[];
}

export interface ModifiedNumClonePart {
    type?:  string;
    part1?: Part1Part2;
    part2?: TentacledPart2;
    name?:  string;
}

export interface TentacledPart2 {
    mCeiling?: number;
    type?:     string;
    parts?:    ModifiedCastRangePart[];
}

export interface TFT15LeeSinSpellReaperStance {
    calculations?:    TFT15LeeSinSpellReaperStanceCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LeeSinSpellReaperStanceCalculations {
    ModifiedStrikeDamage?:    AdditionalDamage[];
    ModifiedAOEDamage?:       AdDamagePerArrowDisplayOnly[];
    ModifiedShockwaveDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15LeeSinSpellTankStance {
    calculations?:    TFT15LeeSinSpellTankStanceCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LeeSinSpellTankStanceCalculations {
    ModifiedInitialDamage?:    AdditionalDamage[];
    ModifiedFinalDamage?:      AdDamagePerArrowDisplayOnly[];
    ModifiedAllEnemiesDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15LuluSpellKogMaw {
    calculations?:    TFT15LuluSpellKogMawCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LuluSpellKogMawCalculations {
    ModifiedDamage?:                AdDamagePerArrowDisplayOnly[];
    ModifiedExtraProjectileDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15LuluSpellRammus {
    calculations?:    TFT15LuluSpellRammusCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LuluSpellRammusCalculations {
    TotalDamage?:      AdditionalDamage[];
    TotalShieldValue?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15LuluSpellSmolder {
    calculations?:    TFT15LuluSpellSmolderCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15LuluSpellSmolderCalculations {
    ModifiedDamage?:      CurrentAutoDamage[];
    ModifiedEmberDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15MalphiteSpellHero {
    calculations?:    TFT15MalphiteSpellHeroCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15MalphiteSpellHeroCalculations {
    ModifiedRange?:  ModifiedNumPageElement[];
    ModifiedDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15MalzaharSpellVisualMIS {
    calculations?:    TFT15MalzaharSpellVisualMISCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15MalzaharSpellVisualMISCalculations {
    ModifiedDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15NeekoSpellCarry {
    calculations?:    TFT15NeekoSpellCarryCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15NeekoSpellCarryCalculations {
    ModifiedHeal?:   AdDamagePerArrowDisplayOnly[];
    ModifiedDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15RyzeSpellTransform {
    calculations?:    TFT15RyzeSpellTransformCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15RyzeSpellTransformCalculations {
    ModifiedDamage?:           AdditionalDamage[];
    ModifiedAdditionalDamage?: AdditionalDamage[];
    ModifiedHeal?:             AdditionalDamage[];
    ModifiedWaveDamage?:       AdditionalDamage[];
}

export interface TFT15ShenSpellHero {
    calculations?:    TFT15ShenSpellHeroCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15ShenSpellHeroCalculations {
    ModifiedDamage?: AdditionalDamage[];
}

export interface TFT15UdyrSpellHero {
    calculations?:    TFT15UdyrSpellHeroCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15UdyrSpellHeroCalculations {
    ModifiedArcDamage?: AdditionalDamage[];
}

export interface TFT15UdyrSpellHeroTransform {
    calculations?:    TFT15UdyrSpellHeroTransformCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15UdyrSpellHeroTransformCalculations {
    ModifiedAS?:              AdDamagePerArrowDisplayOnly[];
    ModifiedArcDamage?:       AdditionalDamage[];
    ModifiedFirestormDamage?: AdditionalDamage[];
    CurrentAutoDamage?:       ModifiedActiveDamage[];
    AS?:                      ModifiedActiveDamage[];
    FirestormBase?:           AdDamagePerArrowDisplayOnly[];
}

export interface TFT15UdyrSpellTransform {
    calculations?:    TFT15UdyrSpellTransformCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15UdyrSpellTransformCalculations {
    ModifiedHealing?:          AdDamagePerArrowDisplayOnly[];
    ModifiedAOEDamage?:        AdDamagePerArrowDisplayOnly[];
    ModifiedFlamestormDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15ViSpellHero {
    calculations?:    TFT15ViSpellHeroCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15ViSpellHeroCalculations {
    ModifiedSecondaryDamage?: AdDamagePerArrowDisplayOnly[];
    TotalDamage?:             AdditionalDamage[];
}

export interface TFT15YasuoSpellTransform {
    calculations?:    TFT15YasuoSpellTransformCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15YasuoSpellTransformCalculations {
    TotalDamage?:             AdditionalDamage[];
    ModifiedTransformDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT15ZacSpellHero {
    calculations?:    TFT15ZacSpellHeroCalculations;
    tooltipElements?: any[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT15ZacSpellHeroCalculations {
    ModifiedDamage?:        AdDamagePerArrowDisplayOnly[];
    ModifiedBigDamage?:     AdDamagePerArrowDisplayOnly[];
    ModifiedManaPerSecond?: AdDamagePerArrowDisplayOnly[];
}

export interface Tft16AtakhanSpellTier {
    calculations?:    TFT16AtakhanSpellTier1Calculations;
    tooltipElements?: TFT16AtakhanSpellTier1TooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
}

export interface TFT16AtakhanSpellTier1Calculations {
    ModifiedCleaveDamage?: AdDamagePerArrowDisplayOnly[];
    "{167b6714}"?:         AdDamagePerArrowDisplayOnly[];
    "{f751aa80}"?:         AdDamagePerArrowDisplayOnly[];
    TotalDotDamage?:       TotalDotDamage[];
}

export interface TFT16AtakhanSpellTier1TooltipElement {
    type?:         TooltipElementType;
    multiplier?:   number;
    nameOverride?: NameOverride;
    Style?:        number;
    name?:         string;
}

export enum NameOverride {
    SpellTFT16AtakhanSpellCleaveDamage = "Spell_TFT16_AtakhanSpell_CleaveDamage",
    SpellTFT16AtakhanSpellDOTDamage = "Spell_TFT16_AtakhanSpell_DOTDamage",
    SpellTFT16AtakhanSpellOmnivamp = "Spell_TFT16_AtakhanSpell_Omnivamp",
}

export enum TooltipElementType {
    CleaveDamage = "CleaveDamage",
    DOTDamage = "DOTDamage",
    Omnivamp = "Omnivamp",
}

export interface TFT16BlitzcrankSpellCarry {
    calculations?:    TFT16BlitzcrankSpellCarryCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
}

export interface TFT16BlitzcrankSpellCarryCalculations {
    ModifiedDamage?:      AdDamagePerArrowDisplayOnly[];
    "{bed1fbfa}"?:        ModifiedRange[];
    ModifiedAttackSpeed?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT16ChoGathHeroSpell {
    calculations?:    TFT16ChoGathHeroSpellCalculations;
    tooltipElements?: TFT16ChoGathHeroSpellTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT16ChoGathHeroSpellCalculations {
    TotalDamage?: AdditionalDamage[];
}

export interface TFT16ChoGathHeroSpellTooltipElement {
    type?:         string;
    nameOverride?: string;
}

export interface TFT16IllaoiSpellCarry {
    calculations?:    TFT16IllaoiSpellCarryCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
}

export interface TFT16IllaoiSpellCarryCalculations {
    TotalDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT16KaisaSpellAP {
    calculations?:    TFT16KaisaSpellAPCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
}

export interface TFT16KaisaSpellAPCalculations {
    ModifiedDamage?:          AdDamagePerArrowDisplayOnly[];
    ModifiedSecondaryDamage?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT16LucianSpellSenna {
    calculations?:    TFT16LucianSpellSennaCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    name?:            string;
    desc?:            string;
}

export interface TFT16LucianSpellSennaCalculations {
    ModifiedDamage?: AdDamagePerArrowDisplayOnly[];
    ModifiedShield?: AdDamagePerArrowDisplayOnly[];
}

export interface TFT16RumbleSpellCarry {
    calculations?:    TFT16RumbleSpellCarryCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    desc?:            string;
}

export interface TFT16RumbleSpellCarryCalculations {
    ModifiedDamage?: AdditionalDamage[];
    TotalNumShots?:  FluffyTotalNumShot[];
    "{5a92690e}"?:   ModifiedNumTarget[];
}

export interface FluffyTotalNumShot {
    type?:  TotalArrowType;
    parts?: FluffyPart[];
}

export interface FluffyPart {
    type?:  string;
    part1?: StickyPart1;
    part2?: PurplePart2;
    name?:  string;
}

export interface StickyPart1 {
    type?:  BattleBonusBlinkDamageType;
    part1?: ModifiedNumSpark;
    part2?: Part1Part2;
}

export interface Tft16SpellCarry {
    calculations?:    TFT16ChoGathHeroSpellCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
}

export interface TFT16ViegoSpellRuinedKing {
    calculations?:    TFT16ViegoSpellRuinedKingCalculations;
    tooltipElements?: AbilityTooltipElement[];
    variables?:       Variable[];
    apiName?:         string;
    nameOverride?:    string;
    descOverride?:    string;
    desc?:            string;
}

export interface TFT16ViegoSpellRuinedKingCalculations {
    TotalDamage?:            AdditionalDamage[];
    ModifiedStackingDamage?: AdDamagePerArrowDisplayOnly[];
    ModifiedAttackSpeed?:    ModifiedCastSnipTime[];
    "{62eb5147}"?:           AdditionalDamage[];
}

export interface Set15MechanicHeroClass {
    Primary?:   string[];
    Secondary?: string[];
}

export interface Stats {
    armor?:          number | null;
    attackSpeed?:    number | null;
    critChance?:     number | null;
    critMultiplier?: number;
    damage?:         number | null;
    hp?:             number | null;
    initialMana?:    number;
    magicResist?:    number | null;
    mana?:           number;
    range?:          number;
}

export interface UnitUnitProperties {
    TFT15_BattleAcademia_Caitlyn_FullPotential_TRA?:  string;
    TFT15_BattleAcademia_Ezreal_FullPotential_TRA?:   string;
    TFT15_BattleAcademia_Garen_FullPotential_TRA?:    string;
    TFT15_BattleAcademia_Jayce_FullPotential_TRA?:    string;
    TFT15_BattleAcademia_Katarina_FullPotential_TRA?: string;
    TFT15_BattleAcademia_Leona_FullPotential_TRA?:    string;
    TFT15_BattleAcademia_Rakan_FullPotential_TRA?:    string;
    TFT15_BattleAcademia_Yuumi_FullPotential_TRA?:    string;
    TFT16_DravenTakedownsRemaining?:                  number;
}

export interface Unlock {
    manual_conditions?: string;
    conditions?:        Condition[];
    levelRequired?:     number;
}

export interface Condition {
    traits?:          ConditionTrait[];
    "{2bbbc039}"?:    number;
    "{9631656f}"?:    number[];
    "{03d6a5a2}"?:    string;
    DescriptionTra?:  string;
    __type?:          ConditionType;
    description?:     string;
    milestoneName?:   string;
    "{9c2c3852}"?:    string;
    "{f60220b1}"?:    number;
    name?:            string;
    Trait?:           string;
    "{241519e9}"?:    number;
    "{cfa2b9d6}"?:    Cfa2B9D6;
    CharacterRecord?: string;
    "{31af55e6}"?:    number;
}

export enum ConditionType {
    A630A690 = "{a630a690}",
    Bb04E22D = "{bb04e22d}",
    F9983033 = "{f9983033}",
    The29124137 = "{29124137}",
}

export interface ConditionTrait {
    Trait?:  string;
    __type?: string;
}

export interface Cfa2B9D6 {
    Item?:            string;
    __type?:          Cfa2B9D6Type;
    "{d39d85bd}"?:    string;
    CharacterRecord?: string;
    "{1996c599}"?:    number;
}

export enum Cfa2B9D6Type {
    C9Feb84A = "{c9feb84a}",
    The08B0381C = "{08b0381c}",
    The3A3De0Cc = "{3a3de0cc}",
}

export interface CompsStats {
    results?:           Result[];
    updated?:           number;
    tft_set?:           string;
    queue_id?:          number | string;
    cluster_id?:        number;
    filter_adjustment?: FilterAdjustment;
}

export interface FilterAdjustment {
    override_applied?: boolean;
    rank_filter?:      string;
    sample_size?:      number;
}

export interface Result {
    cluster?: string;
    places?:  number[];
    count?:   number;
}

export interface CompsDetails {
    results?:    CompsDetailsResults;
    updated?:    number;
    tft_set?:    string;
    queue_id?:   number;
    cluster_id?: number;
}

export interface CompsDetailsResults {
    cluster?:              string;
    placements?:           OverallValue[];
    counters?:             Counter[];
    players?:              { [key: string]: number };
    headliner_traits?:     any[];
    headliner_units?:      any[];
    final_levels?:         FinalLevel[];
    unit_stats?:           UnitStat[];
    builds?:               Build[];
    overall?:              OverallValue;
    itemNames?:            ItemName[];
    items?:                any[];
    options?:              { [key: string]: Option[] };
    trends?:               Trend[];
    traits?:               ResultsTrait[];
    augments?:             ResultsAugment[];
    suggested_legends?:    string[];
    first_carousel?:       FirstCarousel[];
    ranks?:                Rank[];
    levels?:               ResultsLevel[];
    rerolls?:              { [key: string]: Reroll };
    positioning?:          Positioning;
    relative_positioning?: RelativePositioning[];
    early_options?:        { [key: string]: EarlyOption[] };
    portals?:              Portals;
}

export interface ResultsAugment {
    aug?:    string;
    count?:  number;
    avg?:    number;
    orders?: { [key: string]: OverallValue };
    pcnt?:   number;
}

export interface OverallValue {
    count?: number;
    avg?:   number;
}

export interface Build {
    cluster?:             string;
    count?:               number;
    avg?:                 number;
    unit?:                string;
    buildName?:           string[];
    build?:               any[];
    num_items?:           number;
    score?:               number;
    place_change?:        number;
    unit_numitems_count?: number;
    unit_buildNames?:     string;
    adjusted_score?:      number;
}

export interface Counter {
    against?:      number;
    place_change?: number;
    similarity?:   number;
}

export interface EarlyOption {
    cluster?:   string;
    unit_list?: string;
    count?:     number;
    level?:     number;
    avg?:       number;
    win?:       number;
}

export interface FinalLevel {
    level?: string;
    count?: number;
    avg?:   number;
}

export interface FirstCarousel {
    items?:   Composition;
    avg_sum?: number;
    count?:   number;
    avg?:     number;
}

export interface ItemName {
    itemNames?: string;
    count?:     number;
    avg?:       number;
    pcnt?:      number;
    units?:     ItemNameUnit[];
}

export interface ItemNameUnit {
    count?:        number;
    avg?:          number;
    units?:        Units;
    place_change?: number;
    unit_pick?:    number;
    item_pick?:    number;
}

export enum Units {
    TFT15Braum = "TFT15_Braum",
    TFT15Darius = "TFT15_Darius",
    TFT15Jhin = "TFT15_Jhin",
    TFT15KSante = "TFT15_KSante",
    TFT15Malzahar = "TFT15_Malzahar",
    TFT15Neeko = "TFT15_Neeko",
    TFT15Poppy = "TFT15_Poppy",
    TFT15Rakan = "TFT15_Rakan",
    TFT15Rammus = "TFT15_Rammus",
    TFT15Seraphine = "TFT15_Seraphine",
    TFT15Syndra = "TFT15_Syndra",
    TFT15TwistedFate = "TFT15_TwistedFate",
    TFT15Varus = "TFT15_Varus",
    TFT15Yuumi = "TFT15_Yuumi",
    TFT15Zac = "TFT15_Zac",
}

export interface ResultsLevel {
    stage?: string;
    round?: string;
    count?: number;
    level?: number;
}

export interface Option {
    units_list?:  string;
    traits_list?: string;
    score?:       number;
    avg?:         number;
    count?:       number;
}

export interface Portals {
    overall?: PortalsOverall;
    portals?: PortalsPortal[];
}

export interface PortalsOverall {
    avg?:      number;
    pickrate?: number;
    count?:    number;
}

export interface PortalsPortal {
    portal?:       string;
    avg?:          number;
    pickrate?:     number;
    count?:        number;
    portal_count?: number;
}

export interface Positioning {
    positions?: { [key: string]: number };
    units?:     { [key: string]: UnitValue };
}

export interface UnitValue {
    unit?:      string;
    positions?: Position[];
}

export interface Position {
    cell?:  Cell;
    count?: number;
}

export enum Cell {
    Cell1 = "cell_1",
    Cell10 = "cell_10",
    Cell11 = "cell_11",
    Cell12 = "cell_12",
    Cell14 = "cell_14",
    Cell16 = "cell_16",
    Cell17 = "cell_17",
    Cell18 = "cell_18",
    Cell19 = "cell_19",
    Cell2 = "cell_2",
    Cell22 = "cell_22",
    Cell23 = "cell_23",
    Cell24 = "cell_24",
    Cell25 = "cell_25",
    Cell26 = "cell_26",
    Cell27 = "cell_27",
    Cell28 = "cell_28",
    Cell3 = "cell_3",
    Cell4 = "cell_4",
    Cell5 = "cell_5",
    Cell6 = "cell_6",
    Cell7 = "cell_7",
}

export interface Rank {
    rank?:      string;
    count?:     number;
    avg?:       number;
    pick?:      number;
    rank_sort?: number;
}

export interface RelativePositioning {
    relative_positions?: string;
    count?:              number;
    avg?:                number;
}

export interface Reroll {
    rerolls?: number;
    matches?: number;
    count?:   number;
}

export interface ResultsTrait {
    trait?:          string;
    score?:          number;
    count?:          number;
    place_sum?:      number;
    weighted_count?: number;
    levels?:         TraitLevel[];
}

export interface TraitLevel {
    level?: number;
    count?: number;
    avg?:   number;
}

export interface Trend {
    day?:   Date;
    count?: number;
    avg?:   number;
    pick?:  number;
}

export interface UnitStat {
    unit?:      string;
    tiers?:     NumItem[];
    num_items?: NumItem[];
    count?:     number;
    avg?:       number;
    pcnt?:      number;
}

export interface NumItem {
    num_items?: number;
    avg?:       number;
    count?:     number;
    pcnt?:      number;
    tier?:      number;
    itemNames?: string;
}

export interface CompsData {
    results?:    CompsDataResults;
    updated?:    number;
    tft_set?:    string;
    queue_id?:   number | string;
    cluster_id?: number;
}

export interface CompsDataResults {
    data?:  Data;
    games?: { [key: string]: OverallValue[] };
}

export interface Data {
    cluster_id?:      number;
    tft_set?:         string;
    cluster_details?: { [key: string]: ClusterDetail };
    portals?:         DataPortal[];
}

export interface ClusterDetail {
    Cluster?:       number;
    centroid?:      number[];
    units_string?:  string;
    traits_string?: string;
    name?:          Name[];
    name_string?:   string;
    top_headliner?: any[];
    overall?:       OverallValue;
    stars?:         string[];
    stars_4?:       any[];
    builds?:        Build[];
    build_items?:   BuildItems;
    top_itemNames?: Tft15ItemBastionEmblemItem[];
    top_items?:     any[];
    trends?:        Trend[];
    top_augments?:  any[];
    diff_pick?:     number | null;
    diff_place?:    number | null;
    difficulty?:    number;
    levelling?:     Levelling;
}

export interface BuildItems {
    TFT_Item_JeweledGauntlet?:                    Tft15ItemBastionEmblemItem;
    TFT_Item_ArchangelsStaff?:                    Tft15ItemBastionEmblemItem;
    TFT_Item_TitansResolve?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_GuardianAngel?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_GargoyleStoneplate?:                 Tft15ItemBastionEmblemItem;
    TFT_Item_SpearOfShojin?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_InfinityEdge?:                       Tft15ItemBastionEmblemItem;
    TFT_Item_RedBuff?:                            Tft15ItemBastionEmblemItem;
    TFT_Item_DragonsClaw?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_StatikkShiv?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_Deathblade?:                         Tft15ItemBastionEmblemItem;
    TFT_Item_UnstableConcoction?:                 Tft15ItemBastionEmblemItem;
    TFT_Item_Bloodthirster?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_GuinsoosRageblade?:                  Tft15ItemBastionEmblemItem;
    TFT_Item_SteraksGage?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_SpectralGauntlet?:                   Tft15ItemBastionEmblemItem;
    TFT_Item_WarmogsArmor?:                       Tft15ItemBastionEmblemItem;
    TFT_Item_BrambleVest?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_MadredsBloodrazor?:                  Tft15ItemBastionEmblemItem;
    TFT_Item_IonicSpark?:                         Tft15ItemBastionEmblemItem;
    TFT_Item_PowerGauntlet?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_BlueBuff?:                           Tft15ItemBastionEmblemItem;
    TFT_Item_NightHarvester?:                     Tft15ItemBastionEmblemItem;
    TFT_Item_RunaansHurricane?:                   Tft15ItemBastionEmblemItem;
    TFT_Item_LastWhisper?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_Redemption?:                         Tft15ItemBastionEmblemItem;
    TFT15_Item_SoulFighterEmblemItem?:            ItemName;
    TFT_Item_RapidFireCannon?:                    Tft15ItemBastionEmblemItem;
    TFT_Item_RabadonsDeathcap?:                   Tft15ItemBastionEmblemItem;
    TFT_Item_Morellonomicon?:                     Tft15ItemBastionEmblemItem;
    TFT_Item_FrozenHeart?:                        Tft15ItemBastionEmblemItem;
    TFT15_Item_BastionEmblemItem?:                Tft15ItemBastionEmblemItem;
    TFT_Item_Leviathan?:                          Tft15ItemBastionEmblemItem;
    TFT_Item_HextechGunblade?:                    Tft15ItemBastionEmblemItem;
    TFT15_RoboRanger_Core?:                       Tft15ItemBastionEmblemItem;
    TFT15_RoboRanger_Sword?:                      Tft15ItemBastionEmblemItem;
    TFT_Item_Crownguard?:                         ItemName;
    TFT_Item_Quicksilver?:                        Tft15ItemBastionEmblemItem;
    TFT_Item_AdaptiveHelm?:                       NumItem;
    TFT15_RoboRanger_Slicer?:                     ItemName;
    TFT15_Item_HeavyweightEmblemItem?:            ItemName;
    TFT15_Item_JuggernautEmblemItem?:             NumItem;
    TFT16_Item_Bilgewater_LuckyEyepatch?:         NumItem;
    TFT16_Item_Bilgewater_FreebootersFrock?:      NumItem;
    TFT16_Item_Bilgewater_FirstMatesFlintlock?:   Tft15ItemBastionEmblemItem;
    TFT16_Item_Bilgewater_BilgeratCutlass?:       NumItem;
    TFT16_Item_Bilgewater_BlackmarketExplosives?: Tft15ItemBastionEmblemItem;
    TFT16_Item_SlayerEmblemItem?:                 NumItem;
    TFT16_Item_DemaciaEmblemItem?:                NumItem;
    TFT15_Item_ChallengerEmblemItem?:             Tft15ItemBastionEmblemItem;
    TFT_Item_ThiefsGloves?:                       ItemName;
    TFT16_Item_Bilgewater_PileOCitrus?:           ItemName;
    TFT16_Item_RapidfireEmblemItem?:              NumItem;
}

export interface Tft15ItemBastionEmblemItem {
    itemNames?: string;
    count?:     number;
    avg?:       number;
    pcnt?:      number;
    units?:     ItemNameUnit[];
    num_items?: number;
    tier?:      number;
}

export enum Levelling {
    Fast8 = "Fast 8",
    Fast9 = "Fast 9",
    Lvl5 = "lvl 5",
    Lvl6 = "lvl 6",
    Lvl7 = "lvl 7",
    Standard = "Standard",
}

export interface Name {
    name?:  string;
    type?:  NameType;
    score?: number;
}

export enum NameType {
    Trait = "trait",
    Unit = "unit",
}

export interface DataPortal {
    portal?:    string;
    count?:     number;
    place_sum?: number;
    comps?:     Comp[];
    pickrate?:  number;
    avg?:       number;
}

export interface Comp {
    c?:      string;
    a_diff?: number;
    cnt?:    number;
    p_chng?: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toLookups(json: string): Lookups {
        return JSON.parse(json);
    }

    public static lookupsToJson(value: Lookups): string {
        return JSON.stringify(value);
    }

    public static toCompsStats(json: string): CompsStats {
        return JSON.parse(json);
    }

    public static compsStatsToJson(value: CompsStats): string {
        return JSON.stringify(value);
    }

    public static toCompsDetails(json: string): CompsDetails {
        return JSON.parse(json);
    }

    public static compsDetailsToJson(value: CompsDetails): string {
        return JSON.stringify(value);
    }

    public static toCompsData(json: string): CompsData {
        return JSON.parse(json);
    }

    public static compsDataToJson(value: CompsData): string {
        return JSON.stringify(value);
    }
}
