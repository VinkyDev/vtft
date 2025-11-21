// To parse this data:
//
//   import { Convert, CompsStats, CompsDetails, Lookups, CompsData } from "./file";
//
//   const compsStats = Convert.toCompsStats(json);
//   const compsDetails = Convert.toCompsDetails(json);
//   const lookups = Convert.toLookups(json);
//   const compsData = Convert.toCompsData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

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
    items?:   Items;
    avg_sum?: number;
    count?:   number;
    avg?:     number;
}

export enum Items {
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
    composition?:        Items[];
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
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toCompsStats(json: string): CompsStats {
        return cast(JSON.parse(json), r("CompsStats"));
    }

    public static compsStatsToJson(value: CompsStats): string {
        return JSON.stringify(uncast(value, r("CompsStats")), null, 2);
    }

    public static toCompsDetails(json: string): CompsDetails {
        return cast(JSON.parse(json), r("CompsDetails"));
    }

    public static compsDetailsToJson(value: CompsDetails): string {
        return JSON.stringify(uncast(value, r("CompsDetails")), null, 2);
    }

    public static toLookups(json: string): Lookups {
        return cast(JSON.parse(json), r("Lookups"));
    }

    public static lookupsToJson(value: Lookups): string {
        return JSON.stringify(uncast(value, r("Lookups")), null, 2);
    }

    public static toCompsData(json: string): CompsData {
        return cast(JSON.parse(json), r("CompsData"));
    }

    public static compsDataToJson(value: CompsData): string {
        return JSON.stringify(uncast(value, r("CompsData")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "CompsStats": o([
        { json: "results", js: "results", typ: u(undefined, a(r("Result"))) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, u(0, "")) },
        { json: "cluster_id", js: "cluster_id", typ: u(undefined, 0) },
        { json: "filter_adjustment", js: "filter_adjustment", typ: u(undefined, r("FilterAdjustment")) },
    ], false),
    "FilterAdjustment": o([
        { json: "override_applied", js: "override_applied", typ: u(undefined, true) },
        { json: "rank_filter", js: "rank_filter", typ: u(undefined, "") },
        { json: "sample_size", js: "sample_size", typ: u(undefined, 0) },
    ], false),
    "Result": o([
        { json: "cluster", js: "cluster", typ: u(undefined, "") },
        { json: "places", js: "places", typ: u(undefined, a(0)) },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "CompsDetails": o([
        { json: "results", js: "results", typ: u(undefined, r("CompsDetailsResults")) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, 0) },
        { json: "cluster_id", js: "cluster_id", typ: u(undefined, 0) },
    ], false),
    "CompsDetailsResults": o([
        { json: "cluster", js: "cluster", typ: u(undefined, "") },
        { json: "placements", js: "placements", typ: u(undefined, a(r("OverallValue"))) },
        { json: "counters", js: "counters", typ: u(undefined, a(r("Counter"))) },
        { json: "players", js: "players", typ: u(undefined, m(0)) },
        { json: "headliner_traits", js: "headliner_traits", typ: u(undefined, a("any")) },
        { json: "headliner_units", js: "headliner_units", typ: u(undefined, a("any")) },
        { json: "final_levels", js: "final_levels", typ: u(undefined, a(r("FinalLevel"))) },
        { json: "unit_stats", js: "unit_stats", typ: u(undefined, a(r("UnitStat"))) },
        { json: "builds", js: "builds", typ: u(undefined, a(r("Build"))) },
        { json: "overall", js: "overall", typ: u(undefined, r("OverallValue")) },
        { json: "itemNames", js: "itemNames", typ: u(undefined, a(r("ItemName"))) },
        { json: "items", js: "items", typ: u(undefined, a("any")) },
        { json: "options", js: "options", typ: u(undefined, m(a(r("Option")))) },
        { json: "trends", js: "trends", typ: u(undefined, a(r("Trend"))) },
        { json: "traits", js: "traits", typ: u(undefined, a(r("ResultsTrait"))) },
        { json: "augments", js: "augments", typ: u(undefined, a(r("ResultsAugment"))) },
        { json: "suggested_legends", js: "suggested_legends", typ: u(undefined, a("")) },
        { json: "first_carousel", js: "first_carousel", typ: u(undefined, a(r("FirstCarousel"))) },
        { json: "ranks", js: "ranks", typ: u(undefined, a(r("Rank"))) },
        { json: "levels", js: "levels", typ: u(undefined, a(r("ResultsLevel"))) },
        { json: "rerolls", js: "rerolls", typ: u(undefined, m(r("Reroll"))) },
        { json: "positioning", js: "positioning", typ: u(undefined, r("Positioning")) },
        { json: "relative_positioning", js: "relative_positioning", typ: u(undefined, a(r("RelativePositioning"))) },
        { json: "early_options", js: "early_options", typ: u(undefined, m(a(r("EarlyOption")))) },
        { json: "portals", js: "portals", typ: u(undefined, r("Portals")) },
    ], false),
    "ResultsAugment": o([
        { json: "aug", js: "aug", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "orders", js: "orders", typ: u(undefined, m(r("OverallValue"))) },
        { json: "pcnt", js: "pcnt", typ: u(undefined, 0) },
    ], false),
    "OverallValue": o([
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "Build": o([
        { json: "cluster", js: "cluster", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "unit", js: "unit", typ: u(undefined, "") },
        { json: "buildName", js: "buildName", typ: u(undefined, a("")) },
        { json: "build", js: "build", typ: u(undefined, a("any")) },
        { json: "num_items", js: "num_items", typ: u(undefined, 0) },
        { json: "score", js: "score", typ: u(undefined, 3.14) },
        { json: "place_change", js: "place_change", typ: u(undefined, 3.14) },
        { json: "unit_numitems_count", js: "unit_numitems_count", typ: u(undefined, 0) },
        { json: "unit_buildNames", js: "unit_buildNames", typ: u(undefined, "") },
        { json: "adjusted_score", js: "adjusted_score", typ: u(undefined, 3.14) },
    ], false),
    "Counter": o([
        { json: "against", js: "against", typ: u(undefined, 0) },
        { json: "place_change", js: "place_change", typ: u(undefined, 3.14) },
        { json: "similarity", js: "similarity", typ: u(undefined, 3.14) },
    ], false),
    "EarlyOption": o([
        { json: "cluster", js: "cluster", typ: u(undefined, "") },
        { json: "unit_list", js: "unit_list", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "level", js: "level", typ: u(undefined, 3.14) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "win", js: "win", typ: u(undefined, 3.14) },
    ], false),
    "FinalLevel": o([
        { json: "level", js: "level", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "FirstCarousel": o([
        { json: "items", js: "items", typ: u(undefined, r("Items")) },
        { json: "avg_sum", js: "avg_sum", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "ItemName": o([
        { json: "itemNames", js: "itemNames", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pcnt", js: "pcnt", typ: u(undefined, 3.14) },
        { json: "units", js: "units", typ: u(undefined, a(r("ItemNameUnit"))) },
    ], false),
    "ItemNameUnit": o([
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "units", js: "units", typ: u(undefined, r("Units")) },
        { json: "place_change", js: "place_change", typ: u(undefined, 3.14) },
        { json: "unit_pick", js: "unit_pick", typ: u(undefined, 3.14) },
        { json: "item_pick", js: "item_pick", typ: u(undefined, 3.14) },
    ], false),
    "ResultsLevel": o([
        { json: "stage", js: "stage", typ: u(undefined, "") },
        { json: "round", js: "round", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "level", js: "level", typ: u(undefined, 0) },
    ], false),
    "Option": o([
        { json: "units_list", js: "units_list", typ: u(undefined, "") },
        { json: "traits_list", js: "traits_list", typ: u(undefined, "") },
        { json: "score", js: "score", typ: u(undefined, 3.14) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "Portals": o([
        { json: "overall", js: "overall", typ: u(undefined, r("PortalsOverall")) },
        { json: "portals", js: "portals", typ: u(undefined, a(r("PortalsPortal"))) },
    ], false),
    "PortalsOverall": o([
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pickrate", js: "pickrate", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "PortalsPortal": o([
        { json: "portal", js: "portal", typ: u(undefined, "") },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pickrate", js: "pickrate", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "portal_count", js: "portal_count", typ: u(undefined, 0) },
    ], false),
    "Positioning": o([
        { json: "positions", js: "positions", typ: u(undefined, m(0)) },
        { json: "units", js: "units", typ: u(undefined, m(r("UnitValue"))) },
    ], false),
    "UnitValue": o([
        { json: "unit", js: "unit", typ: u(undefined, "") },
        { json: "positions", js: "positions", typ: u(undefined, a(r("Position"))) },
    ], false),
    "Position": o([
        { json: "cell", js: "cell", typ: u(undefined, r("Cell")) },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "Rank": o([
        { json: "rank", js: "rank", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pick", js: "pick", typ: u(undefined, 3.14) },
        { json: "rank_sort", js: "rank_sort", typ: u(undefined, 0) },
    ], false),
    "RelativePositioning": o([
        { json: "relative_positions", js: "relative_positions", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "Reroll": o([
        { json: "rerolls", js: "rerolls", typ: u(undefined, 0) },
        { json: "matches", js: "matches", typ: u(undefined, 0) },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "ResultsTrait": o([
        { json: "trait", js: "trait", typ: u(undefined, "") },
        { json: "score", js: "score", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "place_sum", js: "place_sum", typ: u(undefined, 0) },
        { json: "weighted_count", js: "weighted_count", typ: u(undefined, 0) },
        { json: "levels", js: "levels", typ: u(undefined, a(r("TraitLevel"))) },
    ], false),
    "TraitLevel": o([
        { json: "level", js: "level", typ: u(undefined, 0) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "Trend": o([
        { json: "day", js: "day", typ: u(undefined, Date) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pick", js: "pick", typ: u(undefined, 3.14) },
    ], false),
    "UnitStat": o([
        { json: "unit", js: "unit", typ: u(undefined, "") },
        { json: "tiers", js: "tiers", typ: u(undefined, a(r("NumItem"))) },
        { json: "num_items", js: "num_items", typ: u(undefined, a(r("NumItem"))) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pcnt", js: "pcnt", typ: u(undefined, 3.14) },
    ], false),
    "NumItem": o([
        { json: "num_items", js: "num_items", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "pcnt", js: "pcnt", typ: u(undefined, 3.14) },
        { json: "tier", js: "tier", typ: u(undefined, 0) },
        { json: "itemNames", js: "itemNames", typ: u(undefined, "") },
    ], false),
    "Lookups": o([
        { json: "items", js: "items", typ: u(undefined, a(r("Item"))) },
        { json: "units", js: "units", typ: u(undefined, a(r("LookupsUnit"))) },
        { json: "augments", js: "augments", typ: u(undefined, a(r("LookupsAugment"))) },
        { json: "traits", js: "traits", typ: u(undefined, a(r("LookupsTrait"))) },
        { json: "armory_items", js: "armory_items", typ: u(undefined, a(r("ArmoryItem"))) },
        { json: "augmentOdds", js: "augmentOdds", typ: u(undefined, a(r("AugmentOdd"))) },
        { json: "portals", js: "portals", typ: u(undefined, a("any")) },
        { json: "encounters", js: "encounters", typ: u(undefined, m(r("Encounter"))) },
        { json: "roles", js: "roles", typ: u(undefined, m(r("Role"))) },
        { json: "extraTranslations", js: "extraTranslations", typ: u(undefined, r("ExtraTranslations")) },
        { json: "augmentCategories", js: "augmentCategories", typ: u(undefined, r("AugmentCategories")) },
        { json: "zaps", js: "zaps", typ: u(undefined, a("any")) },
    ], false),
    "ArmoryItem": o([
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "associatedTraits", js: "associatedTraits", typ: u(undefined, a("any")) },
        { json: "composition", js: "composition", typ: u(undefined, a("any")) },
        { json: "desc", js: "desc", typ: u(undefined, "") },
        { json: "effects", js: "effects", typ: u(undefined, m(0)) },
        { json: "from", js: "from", typ: u(undefined, null) },
        { json: "icon", js: "icon", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, null) },
        { json: "incompatibleTraits", js: "incompatibleTraits", typ: u(undefined, a("any")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "tags", js: "tags", typ: u(undefined, a("any")) },
        { json: "unique", js: "unique", typ: u(undefined, true) },
        { json: "en_name", js: "en_name", typ: u(undefined, "") },
        { json: "variable_matches", js: "variable_matches", typ: u(undefined, a(r("VariableMatch"))) },
    ], false),
    "VariableMatch": o([
        { json: "match", js: "match", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("VariableMatchType")) },
        { json: "full_match", js: "full_match", typ: u(undefined, "") },
        { json: "hash", js: "hash", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, u(3.14, null)) },
        { json: "multiplier", js: "multiplier", typ: u(undefined, "") },
        { json: "level", js: "level", typ: u(undefined, "") },
    ], false),
    "AugmentCategories": o([
    ], false),
    "AugmentOdd": o([
        { json: "odds", js: "odds", typ: u(undefined, 3.14) },
        { json: "augments", js: "augments", typ: u(undefined, a(r("AugmentEnum"))) },
    ], false),
    "LookupsAugment": o([
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "associatedTraits", js: "associatedTraits", typ: u(undefined, a("")) },
        { json: "composition", js: "composition", typ: u(undefined, a("any")) },
        { json: "desc", js: "desc", typ: u(undefined, "") },
        { json: "effects", js: "effects", typ: u(undefined, m(u(3.14, null))) },
        { json: "from", js: "from", typ: u(undefined, null) },
        { json: "icon", js: "icon", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, null) },
        { json: "incompatibleTraits", js: "incompatibleTraits", typ: u(undefined, a("")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "tags", js: "tags", typ: u(undefined, a(r("AugmentTag"))) },
        { json: "unique", js: "unique", typ: u(undefined, true) },
        { json: "en_name", js: "en_name", typ: u(undefined, "") },
        { json: "variable_matches", js: "variable_matches", typ: u(undefined, a(r("VariableMatch"))) },
        { json: "type", js: "type", typ: u(undefined, r("AugmentType")) },
        { json: "texture", js: "texture", typ: u(undefined, "") },
        { json: "disabled", js: "disabled", typ: u(undefined, true) },
    ], false),
    "Encounter": o([
        { json: "ChampionSkin", js: "ChampionSkin", typ: u(undefined, "") },
        { json: "EncounterRulesText", js: "EncounterRulesText", typ: u(undefined, "") },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "stages", js: "stages", typ: u(undefined, a(0)) },
        { json: "hyperStages", js: "hyperStages", typ: u(undefined, a(0)) },
        { json: "tags", js: "tags", typ: u(undefined, a(r("EncounterTag"))) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "ExtraTranslations": o([
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_GainADAP", js: "TFT15_RogueCaptain_Bounty_TheCrew_GainADAP", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_CompletedItemAnvil", js: "TFT15_RogueCaptain_Bounty_CompletedItemAnvil", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_ShipReinforcement", js: "TFT15_RogueCaptain_Bounty_TheCrew_ShipReinforcement", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_ArtifactAnvil", js: "TFT15_RogueCaptain_Bounty_ArtifactAnvil", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_GainGoldLarge", js: "TFT15_RogueCaptain_Bounty_GainGoldLarge", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_Random5Cost", js: "TFT15_RogueCaptain_Bounty_Random5Cost", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TankEmpower", js: "TFT15_RogueCaptain_Bounty_TankEmpower", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_GainHealth", js: "TFT15_RogueCaptain_Bounty_TheCrew_GainHealth", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_All5Cost", js: "TFT15_RogueCaptain_Bounty_All5Cost", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_GainAttackSpeed", js: "TFT15_RogueCaptain_Bounty_GainAttackSpeed", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_GainXP", js: "TFT15_RogueCaptain_Bounty_GainXP", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_ThinkFast", js: "TFT15_RogueCaptain_Bounty_ThinkFast", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_CasterEmpower", js: "TFT15_RogueCaptain_Bounty_CasterEmpower", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TemporaryItem", js: "TFT15_RogueCaptain_Bounty_TemporaryItem", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_Random4Cost", js: "TFT15_RogueCaptain_Bounty_Random4Cost", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_GainGoldMedium", js: "TFT15_RogueCaptain_Bounty_GainGoldMedium", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_RocketUpgrade", js: "TFT15_RogueCaptain_Bounty_TheCrew_RocketUpgrade", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_LesserDuplicator", js: "TFT15_RogueCaptain_Bounty_LesserDuplicator", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_GainGold", js: "TFT15_RogueCaptain_Bounty_GainGold", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_All4Cost", js: "TFT15_RogueCaptain_Bounty_All4Cost", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_PermanentAP", js: "TFT15_RogueCaptain_Bounty_PermanentAP", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_3Star", js: "TFT15_RogueCaptain_Bounty_TheCrew_3Star", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TeamShield", js: "TFT15_RogueCaptain_Bounty_TeamShield", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_TheCrew_GoldPerStar", js: "TFT15_RogueCaptain_Bounty_TheCrew_GoldPerStar", typ: u(undefined, "") },
        { json: "TFT15_RogueCaptain_Bounty_FreeRerolls", js: "TFT15_RogueCaptain_Bounty_FreeRerolls", typ: u(undefined, "") },
    ], false),
    "Item": o([
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "associatedTraits", js: "associatedTraits", typ: u(undefined, a(r("AssociatedTrait"))) },
        { json: "composition", js: "composition", typ: u(undefined, a(r("Items"))) },
        { json: "desc", js: "desc", typ: u(undefined, "") },
        { json: "effects", js: "effects", typ: u(undefined, m(u(3.14, null))) },
        { json: "from", js: "from", typ: u(undefined, null) },
        { json: "icon", js: "icon", typ: u(undefined, "") },
        { json: "id", js: "id", typ: u(undefined, null) },
        { json: "incompatibleTraits", js: "incompatibleTraits", typ: u(undefined, a("")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "tags", js: "tags", typ: u(undefined, a(r("ItemTag"))) },
        { json: "unique", js: "unique", typ: u(undefined, true) },
        { json: "en_name", js: "en_name", typ: u(undefined, "") },
        { json: "disabled", js: "disabled", typ: u(undefined, true) },
        { json: "variable_matches", js: "variable_matches", typ: u(undefined, a(r("VariableMatch"))) },
    ], false),
    "Role": o([
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "items", js: "items", typ: u(undefined, a("")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "description", js: "description", typ: u(undefined, "") },
    ], false),
    "LookupsTrait": o([
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
        { json: "effects", js: "effects", typ: u(undefined, a(r("Effect"))) },
        { json: "icon", js: "icon", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "units", js: "units", typ: u(undefined, a(r("TraitUnit"))) },
        { json: "en_name", js: "en_name", typ: u(undefined, "") },
        { json: "set15_mechanic", js: "set15_mechanic", typ: u(undefined, r("TraitSet15Mechanic")) },
        { json: "baseEffects", js: "baseEffects", typ: u(undefined, m(3.14)) },
        { json: "unitProperties", js: "unitProperties", typ: u(undefined, r("TraitUnitProperties")) },
    ], false),
    "Effect": o([
        { json: "maxUnits", js: "maxUnits", typ: u(undefined, 0) },
        { json: "minUnits", js: "minUnits", typ: u(undefined, 0) },
        { json: "style", js: "style", typ: u(undefined, 0) },
        { json: "variables", js: "variables", typ: u(undefined, m(u(3.14, null))) },
        { json: "variable_matches", js: "variable_matches", typ: u(undefined, a(r("VariableMatch"))) },
    ], false),
    "TraitSet15Mechanic": o([
        { json: "Weight", js: "Weight", typ: u(undefined, 0) },
        { json: "AllowMultiple", js: "AllowMultiple", typ: u(undefined, true) },
        { json: "TraitLevel", js: "TraitLevel", typ: u(undefined, 0) },
        { json: "IsTrait", js: "IsTrait", typ: u(undefined, true) },
        { json: "IsPVEAllowed", js: "IsPVEAllowed", typ: u(undefined, true) },
        { json: "MaxStage", js: "MaxStage", typ: u(undefined, 0) },
        { json: "IsStacking", js: "IsStacking", typ: u(undefined, true) },
        { json: "IsChampion", js: "IsChampion", typ: u(undefined, true) },
        { json: "IsCommon", js: "IsCommon", typ: u(undefined, true) },
        { json: "IsWeird", js: "IsWeird", typ: u(undefined, true) },
        { json: "MinLevel", js: "MinLevel", typ: u(undefined, 0) },
        { json: "MinStage", js: "MinStage", typ: u(undefined, 0) },
        { json: "IsDuo", js: "IsDuo", typ: u(undefined, true) },
        { json: "MaxLevel", js: "MaxLevel", typ: u(undefined, 0) },
        { json: "IsSecondPowerUp", js: "IsSecondPowerUp", typ: u(undefined, true) },
        { json: "IsRole", js: "IsRole", typ: u(undefined, true) },
        { json: "InvalidChampions", js: "InvalidChampions", typ: u(undefined, a("")) },
        { json: "MinPlayerHealth", js: "MinPlayerHealth", typ: u(undefined, 0) },
    ], false),
    "TraitUnitProperties": o([
        { json: "TFT15_MechanicTrait_GoldenEdge_Gold", js: "TFT15_MechanicTrait_GoldenEdge_Gold", typ: u(undefined, 0) },
        { json: "TFT15_StarGuardian_RellValue", js: "TFT15_StarGuardian_RellValue", typ: u(undefined, 0) },
        { json: "TFT15_StarGuardian_SyndraValue", js: "TFT15_StarGuardian_SyndraValue", typ: u(undefined, 0) },
        { json: "TFT15_StarGuardian_XayahValue", js: "TFT15_StarGuardian_XayahValue", typ: u(undefined, 0) },
        { json: "TFT15_StarGuardian_AhriValue", js: "TFT15_StarGuardian_AhriValue", typ: u(undefined, 0) },
        { json: "TFT15_StarGuardian_NeekoValue", js: "TFT15_StarGuardian_NeekoValue", typ: u(undefined, 3.14) },
        { json: "TFT15_StarGuardian_PoppyValue", js: "TFT15_StarGuardian_PoppyValue", typ: u(undefined, 3.14) },
        { json: "TFT15_StarGuardian_JinxValue", js: "TFT15_StarGuardian_JinxValue", typ: u(undefined, 3.14) },
        { json: "TFT15_StarGuardian_JinxBonusASValue", js: "TFT15_StarGuardian_JinxBonusASValue", typ: u(undefined, 3.14) },
        { json: "TFT15_StarGuardian_SeraphineValue", js: "TFT15_StarGuardian_SeraphineValue", typ: u(undefined, 3.14) },
        { json: "TFT15_MechanicTrait_Weights_NumWeights", js: "TFT15_MechanicTrait_Weights_NumWeights", typ: u(undefined, 0) },
        { json: "TFT15_Trait_RogueCaptain_CurrentBounty", js: "TFT15_Trait_RogueCaptain_CurrentBounty", typ: u(undefined, "") },
        { json: "TFT16_XerathUnique_PurchasedCharmDisplay", js: "TFT16_XerathUnique_PurchasedCharmDisplay", typ: u(undefined, "") },
        { json: "TFT16_Caretaker_NumRerolls", js: "TFT16_Caretaker_NumRerolls", typ: u(undefined, 0) },
        { json: "TFT16_Ionia_PathTooltip", js: "TFT16_Ionia_PathTooltip", typ: u(undefined, "") },
    ], false),
    "TraitUnit": o([
        { json: "unit", js: "unit", typ: u(undefined, "") },
        { json: "unit_cost", js: "unit_cost", typ: u(undefined, 0) },
    ], false),
    "LookupsUnit": o([
        { json: "ability", js: "ability", typ: u(undefined, r("Ability")) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "characterName", js: "characterName", typ: u(undefined, "") },
        { json: "cost", js: "cost", typ: u(undefined, 0) },
        { json: "icon", js: "icon", typ: u(undefined, u(null, "")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "role", js: "role", typ: u(undefined, u(null, "")) },
        { json: "squareIcon", js: "squareIcon", typ: u(undefined, u(null, "")) },
        { json: "stats", js: "stats", typ: u(undefined, r("Stats")) },
        { json: "tileIcon", js: "tileIcon", typ: u(undefined, "") },
        { json: "traits", js: "traits", typ: u(undefined, a("")) },
        { json: "en_name", js: "en_name", typ: u(undefined, "") },
        { json: "set15_mechanic", js: "set15_mechanic", typ: u(undefined, r("Set15MechanicHeroClass")) },
        { json: "set15_mechanic_hero", js: "set15_mechanic_hero", typ: u(undefined, r("Set15MechanicHeroClass")) },
        { json: "code", js: "code", typ: u(undefined, "") },
        { json: "unitProperties", js: "unitProperties", typ: u(undefined, r("UnitUnitProperties")) },
        { json: "extraAbilities", js: "extraAbilities", typ: u(undefined, r("ExtraAbilities")) },
        { json: "unlock", js: "unlock", typ: u(undefined, r("Unlock")) },
    ], false),
    "Ability": o([
        { json: "desc", js: "desc", typ: u(undefined, "") },
        { json: "icon", js: "icon", typ: u(undefined, u(null, "")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "calculations", js: "calculations", typ: u(undefined, r("AbilityCalculations")) },
    ], false),
    "AbilityCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("TotalDamageElement"))) },
        { json: "TotalHealing", js: "TotalHealing", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("ModifiedDamage"))) },
        { json: "ModifiedSecondaryDamage", js: "ModifiedSecondaryDamage", typ: u(undefined, a(r("ModifiedSecondaryDamage"))) },
        { json: "Total_Dash_Damage", js: "Total_Dash_Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "Total_Strike_Damage", js: "Total_Strike_Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalArrows", js: "TotalArrows", typ: u(undefined, a(r("TotalArrow"))) },
        { json: "ArrowAPDamageDisplayOnly", js: "ArrowAPDamageDisplayOnly", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ADDamagePerArrowDisplayOnly", js: "ADDamagePerArrowDisplayOnly", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAOEDamage", js: "ModifiedAOEDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedThrowDamage", js: "ModifiedThrowDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ExecuteThreshold", js: "ExecuteThreshold", typ: u(undefined, a(r("ExecuteThreshold"))) },
        { json: "ModifiedPrimaryDamage", js: "ModifiedPrimaryDamage", typ: u(undefined, a(r("ModifiedPrimaryDamage"))) },
        { json: "ModifiedNumBounces", js: "ModifiedNumBounces", typ: u(undefined, a(r("ModifiedBonusAd"))) },
        { json: "ModifiedHeal", js: "ModifiedHeal", typ: u(undefined, a(r("ModifiedHeal"))) },
        { json: "ModifiedADDamage", js: "ModifiedADDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAPDamage", js: "ModifiedAPDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBonusAD", js: "ModifiedBonusAD", typ: u(undefined, a(r("ModifiedBonusAd"))) },
        { json: "{157063a4}", js: "{157063a4}", typ: u(undefined, a(r("ModifiedBonusAd"))) },
        { json: "ModifiedUltimateBarrageADDamage", js: "ModifiedUltimateBarrageADDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedUltimateBarrageAPDamage", js: "ModifiedUltimateBarrageAPDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "AdditionalDamage", js: "AdditionalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedHealthGain", js: "ModifiedHealthGain", typ: u(undefined, a(r("ModifiedHealthGainElement"))) },
        { json: "ModifiedConeDamage", js: "ModifiedConeDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedNeedleDamage", js: "ModifiedNeedleDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBurstDamage", js: "ModifiedBurstDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDividedDamage", js: "ModifiedDividedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedConeSplitDamage", js: "ModifiedConeSplitDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAllyShield", js: "ModifiedAllyShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "DamageTotal", js: "DamageTotal", typ: u(undefined, a(r("DamageTotal"))) },
        { json: "ModifiedShield", js: "ModifiedShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedNumSparks", js: "ModifiedNumSparks", typ: u(undefined, a(r("ModifiedNumSpark"))) },
        { json: "ModifiedSparkDamage", js: "ModifiedSparkDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedASPerStack", js: "ModifiedASPerStack", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedRocketAOEDamage", js: "ModifiedRocketAOEDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ASPerCrit", js: "ASPerCrit", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedMaxAS", js: "ModifiedMaxAS", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDurability", js: "ModifiedDurability", typ: u(undefined, a(r("ModifiedDurability"))) },
        { json: "ModifiedTankDamage", js: "ModifiedTankDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedFighterDamage", js: "ModifiedFighterDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAD", js: "ModifiedAD", typ: u(undefined, a(r("ModifiedAD"))) },
        { json: "ModifiedAS", js: "ModifiedAS", typ: u(undefined, a(r("ExecuteThreshold"))) },
        { json: "BattleBonusBlinkDamage", js: "BattleBonusBlinkDamage", typ: u(undefined, a(r("BattleBonusBlinkDamage"))) },
        { json: "ModifiedUltimateMagicDamage", js: "ModifiedUltimateMagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "AscensionModifiedMagicDamage", js: "AscensionModifiedMagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalShield", js: "TotalShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{51873b7f}", js: "{51873b7f}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{c9683efc}", js: "{c9683efc}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{551c31f1}", js: "{551c31f1}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{d0012fce}", js: "{d0012fce}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{9f9650f3}", js: "{9f9650f3}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSunburstDamage", js: "ModifiedSunburstDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedResistSteal", js: "ModifiedResistSteal", typ: u(undefined, a(r("ModifiedNumSpark"))) },
        { json: "ModifiedBaseDamage", js: "ModifiedBaseDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedResists", js: "ModifiedResists", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "FinalShield", js: "FinalShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "SecondaryDamage", js: "SecondaryDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "MaxStunDuration", js: "MaxStunDuration", typ: u(undefined, a(r("MaxStunDuration"))) },
        { json: "ModifiedPotentialHeal", js: "ModifiedPotentialHeal", typ: u(undefined, a(r("ModifiedHealthGainElement"))) },
        { json: "ModifiedUltimateHeal", js: "ModifiedUltimateHeal", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedFlatDamageReduction", js: "ModifiedFlatDamageReduction", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAdditionalDamage", js: "ModifiedAdditionalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedQBulletDamage", js: "ModifiedQBulletDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedCastRange", js: "ModifiedCastRange", typ: u(undefined, a(r("ModifiedCastRange"))) },
        { json: "ModifiedFlurryDamage", js: "ModifiedFlurryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedTrueDamage", js: "ModifiedTrueDamage", typ: u(undefined, a(r("ModifiedTrueDamage"))) },
        { json: "ModifiedInitialHealth", js: "ModifiedInitialHealth", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedHealing", js: "ModifiedHealing", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedRange", js: "ModifiedRange", typ: u(undefined, a(r("ModifiedRange"))) },
        { json: "TotalArrowDamage", js: "TotalArrowDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedArrowsPerSecond", js: "ModifiedArrowsPerSecond", typ: u(undefined, a(r("ModifiedArrowsPerSecond"))) },
        { json: "ModifiedPassiveDamage", js: "ModifiedPassiveDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedComboDamage", js: "ModifiedComboDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedFinalComboDamage", js: "ModifiedFinalComboDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "CurrentAutoDamage", js: "CurrentAutoDamage", typ: u(undefined, a(r("CurrentAutoDamage"))) },
        { json: "FinalAttackSpeed", js: "FinalAttackSpeed", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedStrikeDamage", js: "ModifiedStrikeDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAttackTrueDamage", js: "ModifiedAttackTrueDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAttackMagicDamage", js: "ModifiedAttackMagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedNumPages", js: "ModifiedNumPages", typ: u(undefined, a(r("ModifiedNumPageElement"))) },
        { json: "ModifiedMagicPageDamage", js: "ModifiedMagicPageDamage", typ: u(undefined, a(r("ModifiedMagicPageDamage"))) },
        { json: "FinalDamage", js: "FinalDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalAttackDamage", js: "TotalAttackDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedExplosionDamage", js: "ModifiedExplosionDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "CurrentAutoValue", js: "CurrentAutoValue", typ: u(undefined, a(r("CurrentAutoDamage"))) },
        { json: "ModifiedAttackSpeed", js: "ModifiedAttackSpeed", typ: u(undefined, a(r("ModifiedAttackSpeed"))) },
        { json: "SlamDamage", js: "SlamDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedOmnivamp", js: "ModifiedOmnivamp", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedExtraProjectileDamage", js: "ModifiedExtraProjectileDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedEmberDamage", js: "ModifiedEmberDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedGoldChance", js: "ModifiedGoldChance", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "TotalHeal", js: "TotalHeal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "MaxAS", js: "MaxAS", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{90b31848}", js: "{90b31848}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell1Damage", js: "ModifiedSpell1Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell2Damage", js: "ModifiedSpell2Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell2SecondaryDamage", js: "ModifiedSpell2SecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell3Damage", js: "ModifiedSpell3Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell3SecondaryDamage", js: "ModifiedSpell3SecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedCoreEnergyShield", js: "ModifiedCoreEnergyShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell4LandingDamage", js: "ModifiedSpell4LandingDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedMagicDamage", js: "ModifiedMagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalShieldValue", js: "TotalShieldValue", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedLeapHealth", js: "ModifiedLeapHealth", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "FinalAttackDamage", js: "FinalAttackDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedDamagePerSecond", js: "ModifiedDamagePerSecond", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBonusAPDamage", js: "ModifiedBonusAPDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamageReduction", js: "ModifiedDamageReduction", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedNumAttacks", js: "ModifiedNumAttacks", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamage_Q", js: "ModifiedDamage_Q", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "SmallArrowDamageFinal", js: "SmallArrowDamageFinal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBigCastDamage", js: "ModifiedBigCastDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamagePerCrystal", js: "ModifiedDamagePerCrystal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBigCastHeal", js: "ModifiedBigCastHeal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDefenses", js: "ModifiedDefenses", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedCloneHealth", js: "ModifiedCloneHealth", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedHealPercentage", js: "ModifiedHealPercentage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDivebombDamage", js: "ModifiedDivebombDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedFireDamagePerSecond", js: "ModifiedFireDamagePerSecond", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedActiveDamage", js: "ModifiedActiveDamage", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
        { json: "BonusPassiveDamage", js: "BonusPassiveDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ReducedModifiedDamage", js: "ReducedModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedPercentOfTargetMaxHealth", js: "ModifiedPercentOfTargetMaxHealth", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSlamDamage", js: "ModifiedSlamDamage", typ: u(undefined, a(r("ModifiedSlamDamage"))) },
        { json: "ModifiedRockDamage", js: "ModifiedRockDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedMissileDamage", js: "ModifiedMissileDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "ModifiedLaserDamagePerSecond", js: "ModifiedLaserDamagePerSecond", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedMissilesPerSecond", js: "ModifiedMissilesPerSecond", typ: u(undefined, a(r("ModifiedMissilesPerSecond"))) },
        { json: "ModifiedHealPerSecond", js: "ModifiedHealPerSecond", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedManaPerSec", js: "ModifiedManaPerSec", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
        { json: "ModifiedThreshold1Damage", js: "ModifiedThreshold1Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedThreshold7Damage", js: "ModifiedThreshold7Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAcidDamage", js: "ModifiedAcidDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "ModifiedBasicAttackADDamage", js: "ModifiedBasicAttackADDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBasicAttackAPDamage", js: "ModifiedBasicAttackAPDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedPerTargetDamage", js: "ModifiedPerTargetDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedTakedownAttackSpeed", js: "ModifiedTakedownAttackSpeed", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAttackDamage", js: "ModifiedAttackDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedMaxDamage", js: "ModifiedMaxDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBasicAttackDamage", js: "ModifiedBasicAttackDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedMinDamage", js: "ModifiedMinDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "FirstCastModifiedDamage", js: "FirstCastModifiedDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "SecondCastModifiedDamage", js: "SecondCastModifiedDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "ThirdCastModifiedDamage", js: "ThirdCastModifiedDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "ModifiedBiteDamage", js: "ModifiedBiteDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedBoltDamage", js: "ModifiedBoltDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "{d678dbfb}", js: "{d678dbfb}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedJarvanDamage", js: "ModifiedJarvanDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedGarenDamage", js: "ModifiedGarenDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedLuxDamage", js: "ModifiedLuxDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDemaciaExecuteThreshold", js: "ModifiedDemaciaExecuteThreshold", typ: u(undefined, a(r("ModifiedDemaciaExecuteThreshold"))) },
        { json: "ModifiedFreljordTrueDamage", js: "ModifiedFreljordTrueDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedShadowIslesBonusDamage", js: "ModifiedShadowIslesBonusDamage", typ: u(undefined, a(r("ModifiedShadowIslesBonusDamage"))) },
        { json: "ModifiedZaunTicks", js: "ModifiedZaunTicks", typ: u(undefined, a(r("ModifiedZaunTick"))) },
        { json: "ModifiedTargetDamage", js: "ModifiedTargetDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSlashDamage", js: "ModifiedSlashDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedDashDamage", js: "ModifiedDashDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedHealthSteal", js: "ModifiedHealthSteal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedHealthDrain", js: "ModifiedHealthDrain", typ: u(undefined, a(r("ModifiedHealthDrain"))) },
        { json: "ModifiedCastSnipTimes", js: "ModifiedCastSnipTimes", typ: u(undefined, a(r("ModifiedCastSnipTime"))) },
        { json: "TotalNumberOfSpears", js: "TotalNumberOfSpears", typ: u(undefined, a(r("ModifiedCastSnipTime"))) },
        { json: "ModifiedNumTargets", js: "ModifiedNumTargets", typ: u(undefined, a(r("ModifiedNumTarget"))) },
        { json: "ModifiedStackingDamage", js: "ModifiedStackingDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "BonusMagicDamage", js: "BonusMagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "MagicDamage", js: "MagicDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedCleaveDamage", js: "ModifiedCleaveDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{167b6714}", js: "{167b6714}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{f751aa80}", js: "{f751aa80}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalDotDamage", js: "TotalDotDamage", typ: u(undefined, a(r("TotalDotDamage"))) },
        { json: "ModifiedHandDamage", js: "ModifiedHandDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBigAOEDamage", js: "ModifiedBigAOEDamage", typ: u(undefined, a(r("ModifiedAcidDamageElement"))) },
        { json: "TotalNumShots", js: "TotalNumShots", typ: u(undefined, a(r("PurpleTotalNumShot"))) },
        { json: "ModifiedSelfHeal", js: "ModifiedSelfHeal", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "AdDamagePerArrowDisplayOnly": o([
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "mStyleTagIfScaled", js: "mStyleTagIfScaled", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "value", js: "value", typ: u(undefined, r("Value")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "mStyleTag", js: "mStyleTag", typ: u(undefined, "") },
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, r("MBuffName")) },
        { json: "mStatFormula", js: "mStatFormula", typ: u(undefined, 0) },
    ], false),
    "TotalArrow": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
    ], false),
    "Value": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "mNumber", js: "mNumber", typ: u(undefined, 0) },
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, r("MBuffName")) },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 0) },
    ], false),
    "AdditionalDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "BattleBonusBlinkDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("ModifiedBonusAd")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part2Element")) },
    ], false),
    "ModifiedBonusAd": o([
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, r("MBuffName")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("ModifiedBonusADType")) },
        { json: "mIconKey", js: "mIconKey", typ: u(undefined, "") },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 0) },
    ], false),
    "Part2Element": o([
        { json: "mSpellCalculationKey", js: "mSpellCalculationKey", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("ModifiedAcidDamageType")) },
    ], false),
    "BonusPassiveDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedPassiveDamage"))) },
    ], false),
    "ModifiedPassiveDamage": o([
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
    ], false),
    "CurrentAutoDamage": o([
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("CurrentAutoDamageType")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "DamageTotal": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("Part2Element")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ExecuteThreshold": o([
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "MaxStunDuration": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("TotalArrow")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "ModifiedAD": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("BonusPassiveDamage")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedAcidDamageElement": o([
        { json: "type", js: "type", typ: u(undefined, r("ModifiedAcidDamageType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "value", js: "value", typ: u(undefined, r("TotalArrow")) },
        { json: "mSpellCalculationKey", js: "mSpellCalculationKey", typ: u(undefined, "") },
    ], false),
    "ModifiedActiveDamage": o([
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("CurrentAutoDamageType")) },
        { json: "mStatFormula", js: "mStatFormula", typ: u(undefined, 0) },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 3.14) },
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
    ], false),
    "ModifiedArrowsPerSecond": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
    ], false),
    "ModifiedAttackSpeed": o([
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedAttackSpeedPart"))) },
        { json: "value", js: "value", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedAttackSpeedPart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("PurplePart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "PurplePart1": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("FluffyPart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part1Part2")) },
    ], false),
    "FluffyPart1": o([
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, r("MBuffName")) },
        { json: "mIconKey", js: "mIconKey", typ: u(undefined, "") },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 0) },
        { json: "type", js: "type", typ: u(undefined, r("ModifiedBonusADType")) },
    ], false),
    "Part1Part2": o([
        { json: "part1", js: "part1", typ: u(undefined, r("Part2Part1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part2Part2")) },
        { json: "type", js: "type", typ: u(undefined, r("FluffyType")) },
    ], false),
    "Part2Part1": o([
        { json: "mDataValue", js: "mDataValue", typ: u(undefined, "") },
        { json: "__type", js: "__type", typ: u(undefined, r("TotalArrowType")) },
    ], false),
    "Part2Part2": o([
        { json: "mNumber", js: "mNumber", typ: u(undefined, 0) },
        { json: "__type", js: "__type", typ: u(undefined, r("PurpleType")) },
    ], false),
    "ModifiedCastRange": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedCastRangePart"))) },
        { json: "mNumber", js: "mNumber", typ: u(undefined, 0) },
    ], false),
    "ModifiedCastRangePart": o([
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("PurpleType")) },
        { json: "mNumber", js: "mNumber", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "mStatFormula", js: "mStatFormula", typ: u(undefined, 0) },
    ], false),
    "ModifiedCastSnipTime": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedAttackSpeedPart"))) },
    ], false),
    "ModifiedDamage": o([
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "mStyleTag", js: "mStyleTag", typ: u(undefined, "") },
        { json: "mStyleTagIfScaled", js: "mStyleTagIfScaled", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedDemaciaExecuteThreshold": o([
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedDemaciaExecuteThresholdPart"))) },
    ], false),
    "ModifiedDemaciaExecuteThresholdPart": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("ModifiedArrowsPerSecond")) },
        { json: "part2", js: "part2", typ: u(undefined, r("PurplePart2")) },
    ], false),
    "PurplePart2": o([
        { json: "mNumber", js: "mNumber", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("PurpleType")) },
    ], false),
    "ModifiedDurability": o([
        { json: "mBonusStatForEfficiency", js: "mBonusStatForEfficiency", typ: u(undefined, 0) },
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "ModifiedHeal": o([
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedHealPart"))) },
        { json: "mStyleTag", js: "mStyleTag", typ: u(undefined, "") },
        { json: "mStyleTagIfScaled", js: "mStyleTagIfScaled", typ: u(undefined, "") },
    ], false),
    "ModifiedHealPart": o([
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("PurplePart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedHealthDrain": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedHealthDrainPart"))) },
    ], false),
    "ModifiedHealthDrainPart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("PurplePart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedHealthGainElement": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedHealthGainPart"))) },
    ], false),
    "ModifiedHealthGainPart": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, r("MBuffName")) },
    ], false),
    "ModifiedMagicPageDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("Part2Element")) },
        { json: "part2", js: "part2", typ: u(undefined, r("ModifiedBonusAd")) },
    ], false),
    "ModifiedMissilesPerSecond": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedMissilesPerSecondPart"))) },
    ], false),
    "ModifiedMissilesPerSecondPart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("TentacledPart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part1Part2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "TentacledPart1": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedCastRangePart"))) },
    ], false),
    "ModifiedNumPageElement": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedNumSpark"))) },
    ], false),
    "ModifiedNumSpark": o([
        { json: "mBuffName", js: "mBuffName", typ: u(undefined, "") },
        { json: "mIconKey", js: "mIconKey", typ: u(undefined, "") },
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("ModifiedBonusADType")) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "mStatFormula", js: "mStatFormula", typ: u(undefined, 0) },
    ], false),
    "ModifiedNumTarget": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedNumTargetPart"))) },
    ], false),
    "ModifiedNumTargetPart": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("PurpleType")) },
        { json: "mNumber", js: "mNumber", typ: u(undefined, 0) },
    ], false),
    "ModifiedPrimaryDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("TotalArrow"))) },
    ], false),
    "ModifiedRange": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("CurrentAutoDamage"))) },
    ], false),
    "ModifiedSecondaryDamage": o([
        { json: "mRatio", js: "mRatio", typ: u(undefined, 3.14) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "part", js: "part", typ: u(undefined, r("TotalArrow")) },
        { json: "mStat", js: "mStat", typ: u(undefined, 0) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "value", js: "value", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedShadowIslesBonusDamage": o([
        { json: "displayAsPercent", js: "displayAsPercent", typ: u(undefined, true) },
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedShadowIslesBonusDamagePart"))) },
    ], false),
    "ModifiedShadowIslesBonusDamagePart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("PurplePart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("PurplePart2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "ModifiedSlamDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "value", js: "value", typ: u(undefined, r("TotalArrow")) },
    ], false),
    "ModifiedTrueDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedTrueDamagePart"))) },
    ], false),
    "ModifiedTrueDamagePart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("TotalArrow")) },
        { json: "part2", js: "part2", typ: u(undefined, r("FluffyPart2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "FluffyPart2": o([
        { json: "mCoefficient", js: "mCoefficient", typ: u(undefined, 0) },
        { json: "mAbilityResource", js: "mAbilityResource", typ: u(undefined, 0) },
        { json: "type", js: "type", typ: u(undefined, "") },
    ], false),
    "ModifiedZaunTick": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedZaunTickPart"))) },
    ], false),
    "ModifiedZaunTickPart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("ModifiedMissilesPerSecondPart")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TotalArrow")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "TotalDamageElement": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "part1", js: "part1", typ: u(undefined, r("Part2Element")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part2Element")) },
    ], false),
    "TotalDotDamage": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("Part2Element"))) },
    ], false),
    "PurpleTotalNumShot": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("PurplePart"))) },
    ], false),
    "PurplePart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("ModifiedMissilesPerSecondPart")) },
        { json: "part2", js: "part2", typ: u(undefined, r("PurplePart2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "AbilityTooltipElement": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "multiplier", js: "multiplier", typ: u(undefined, 0) },
        { json: "Style", js: "Style", typ: u(undefined, 0) },
        { json: "typeIndex", js: "typeIndex", typ: u(undefined, 0) },
    ], false),
    "Variable": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, a(3.14)) },
    ], false),
    "ExtraAbilities": o([
        { json: "TFT15_GarenSpell_Carry", js: "TFT15_GarenSpell_Carry", typ: u(undefined, r("TFT15GarenSpellCarry")) },
        { json: "TFT15_KSanteSpell_Fighter", js: "TFT15_KSanteSpell_Fighter", typ: u(undefined, r("TFT15KSanteSpellFighter")) },
        { json: "TFT15_KennenSpellHero", js: "TFT15_KennenSpellHero", typ: u(undefined, r("TFT15KennenSpellHero")) },
        { json: "TFT15_KobukoSpell_Transform", js: "TFT15_KobukoSpell_Transform", typ: u(undefined, r("TFT15KobukoSpellTransform")) },
        { json: "TFT15_LeeSinSpell_ReaperStance", js: "TFT15_LeeSinSpell_ReaperStance", typ: u(undefined, r("TFT15LeeSinSpellReaperStance")) },
        { json: "TFT15_LeeSinSpell_FighterStance", js: "TFT15_LeeSinSpell_FighterStance", typ: u(undefined, r("TFT15LeeSinSpellFighterStance")) },
        { json: "TFT15_LeeSinSpell_TankStance", js: "TFT15_LeeSinSpell_TankStance", typ: u(undefined, r("TFT15LeeSinSpellTankStance")) },
        { json: "TFT15_LuluSpell_KogMaw", js: "TFT15_LuluSpell_KogMaw", typ: u(undefined, r("TFT15LuluSpellKogMaw")) },
        { json: "TFT15_LuluSpell_Rammus", js: "TFT15_LuluSpell_Rammus", typ: u(undefined, r("TFT15LuluSpellRammus")) },
        { json: "TFT15_LuluSpell_Smolder", js: "TFT15_LuluSpell_Smolder", typ: u(undefined, r("TFT15LuluSpellSmolder")) },
        { json: "TFT15_MalphiteSpellHero", js: "TFT15_MalphiteSpellHero", typ: u(undefined, r("TFT15MalphiteSpellHero")) },
        { json: "TFT15_MalzaharSpell_VisualMis", js: "TFT15_MalzaharSpell_VisualMis", typ: u(undefined, r("TFT15MalzaharSpellVisualMIS")) },
        { json: "TFT15_RyzeSpell_Transform", js: "TFT15_RyzeSpell_Transform", typ: u(undefined, r("TFT15RyzeSpellTransform")) },
        { json: "TFT15_UdyrSpellHero_Transform", js: "TFT15_UdyrSpellHero_Transform", typ: u(undefined, r("TFT15UdyrSpellHeroTransform")) },
        { json: "TFT15_UdyrSpellHero", js: "TFT15_UdyrSpellHero", typ: u(undefined, r("TFT15UdyrSpellHero")) },
        { json: "TFT15_UdyrSpell_Transform", js: "TFT15_UdyrSpell_Transform", typ: u(undefined, r("TFT15UdyrSpellTransform")) },
        { json: "TFT15_YasuoSpell_Transform", js: "TFT15_YasuoSpell_Transform", typ: u(undefined, r("TFT15YasuoSpellTransform")) },
        { json: "TFT15_ZacSpellHero", js: "TFT15_ZacSpellHero", typ: u(undefined, r("TFT15ZacSpellHero")) },
        { json: "TFT15_DrMundoSpellHero", js: "TFT15_DrMundoSpellHero", typ: u(undefined, r("TFT15DRMundoSpellHero")) },
        { json: "TFT15_ViSpellHero", js: "TFT15_ViSpellHero", typ: u(undefined, r("TFT15ViSpellHero")) },
        { json: "TFT15_Galio_Spell2", js: "TFT15_Galio_Spell2", typ: u(undefined, r("Tft15GalioSpell")) },
        { json: "TFT15_Galio_Spell3", js: "TFT15_Galio_Spell3", typ: u(undefined, r("Tft15GalioSpell")) },
        { json: "TFT15_Galio_Spell4", js: "TFT15_Galio_Spell4", typ: u(undefined, r("Tft15GalioSpell")) },
        { json: "TFT15_ShenSpellHero", js: "TFT15_ShenSpellHero", typ: u(undefined, r("TFT15ShenSpellHero")) },
        { json: "TFT15_NeekoSpell_Carry", js: "TFT15_NeekoSpell_Carry", typ: u(undefined, r("TFT15NeekoSpellCarry")) },
        { json: "TFT16_RumbleSpell_Carry", js: "TFT16_RumbleSpell_Carry", typ: u(undefined, r("TFT16RumbleSpellCarry")) },
        { json: "TFT16_IllaoiSpell_Carry", js: "TFT16_IllaoiSpell_Carry", typ: u(undefined, r("TFT16IllaoiSpellCarry")) },
        { json: "TFT16_ShenSpellCarry", js: "TFT16_ShenSpellCarry", typ: u(undefined, r("Tft16SpellCarry")) },
        { json: "TFT16_ChoGathHeroSpell", js: "TFT16_ChoGathHeroSpell", typ: u(undefined, r("TFT16ChoGathHeroSpell")) },
        { json: "TFT16_KaisaSpell_AP", js: "TFT16_KaisaSpell_AP", typ: u(undefined, r("TFT16KaisaSpellAP")) },
        { json: "TFT16_ViegoSpell_RuinedKing", js: "TFT16_ViegoSpell_RuinedKing", typ: u(undefined, r("TFT16ViegoSpellRuinedKing")) },
        { json: "TFT16_AtakhanSpellTier3", js: "TFT16_AtakhanSpellTier3", typ: u(undefined, r("Tft16AtakhanSpellTier")) },
        { json: "TFT16_AtakhanSpellTier2", js: "TFT16_AtakhanSpellTier2", typ: u(undefined, r("Tft16AtakhanSpellTier")) },
        { json: "TFT16_AtakhanSpellTier1", js: "TFT16_AtakhanSpellTier1", typ: u(undefined, r("Tft16AtakhanSpellTier")) },
        { json: "TFT16_AtakhanSpellTier4", js: "TFT16_AtakhanSpellTier4", typ: u(undefined, r("Tft16AtakhanSpellTier")) },
        { json: "TFT16_XinZhaoSpellCarry", js: "TFT16_XinZhaoSpellCarry", typ: u(undefined, r("Tft16SpellCarry")) },
        { json: "TFT16_BlitzcrankSpell_Carry", js: "TFT16_BlitzcrankSpell_Carry", typ: u(undefined, r("TFT16BlitzcrankSpellCarry")) },
        { json: "TFT16_LucianSpell_Senna", js: "TFT16_LucianSpell_Senna", typ: u(undefined, r("TFT16LucianSpellSenna")) },
    ], false),
    "TFT15DRMundoSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15DRMundoSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15DRMundoSpellHeroCalculations": o([
        { json: "ModifiedChairDamage", js: "ModifiedChairDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedSpellDamage", js: "ModifiedSpellDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedSplashPercent", js: "ModifiedSplashPercent", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSplashDamage", js: "ModifiedSplashDamage", typ: u(undefined, a(r("TotalDamageElement"))) },
        { json: "CurrentAutoValue", js: "CurrentAutoValue", typ: u(undefined, a(r("CurrentAutoDamage"))) },
    ], false),
    "Tft15GalioSpell": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15GalioSpell2Calculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15GalioSpell2Calculations": o([
        { json: "{90b31848}", js: "{90b31848}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell1Damage", js: "ModifiedSpell1Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell2Damage", js: "ModifiedSpell2Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell2SecondaryDamage", js: "ModifiedSpell2SecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell3Damage", js: "ModifiedSpell3Damage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSpell3SecondaryDamage", js: "ModifiedSpell3SecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedCoreEnergyShield", js: "ModifiedCoreEnergyShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedPassiveDamage", js: "ModifiedPassiveDamage", typ: u(undefined, a(r("ModifiedPassiveDamage"))) },
        { json: "ModifiedSpell4LandingDamage", js: "ModifiedSpell4LandingDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15GarenSpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15GarenSpellCarryCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15GarenSpellCarryCalculations": o([
        { json: "TotalExecuteThreshold", js: "TotalExecuteThreshold", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "AdditionalDamage", js: "AdditionalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "{4c6b27b7}", js: "{4c6b27b7}", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedHealthGain", js: "ModifiedHealthGain", typ: u(undefined, a(r("ModifiedHealthGainElement"))) },
    ], false),
    "TFT15KSanteSpellFighter": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15KSanteSpellFighterCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15KSanteSpellFighterCalculations": o([
        { json: "ModifiedDurability", js: "ModifiedDurability", typ: u(undefined, a(r("ModifiedDurability"))) },
        { json: "ModifiedTankDamage", js: "ModifiedTankDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedFighterDamage", js: "ModifiedFighterDamage", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedAD", js: "ModifiedAD", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedAS", js: "ModifiedAS", typ: u(undefined, a(r("BonusPassiveDamage"))) },
        { json: "ModifiedHeal", js: "ModifiedHeal", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
    ], false),
    "TFT15KennenSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15KennenSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15KennenSpellHeroCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedPassiveDamage", js: "ModifiedPassiveDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15KobukoSpellTransform": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15KobukoSpellTransformCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15KobukoSpellTransformCalculations": o([
        { json: "TotalShield", js: "TotalShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedLineDamage", js: "ModifiedLineDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15LeeSinSpellFighterStance": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LeeSinSpellFighterStanceCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LeeSinSpellFighterStanceCalculations": o([
        { json: "ModifiedArmorShred", js: "ModifiedArmorShred", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedNumClones", js: "ModifiedNumClones", typ: u(undefined, a(r("ModifiedNumClone"))) },
        { json: "ModifiedCloneDamage", js: "ModifiedCloneDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedPassiveCloneDamage", js: "ModifiedPassiveCloneDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "ModifiedNumClone": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedNumClonePart"))) },
    ], false),
    "ModifiedNumClonePart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("Part1Part2")) },
        { json: "part2", js: "part2", typ: u(undefined, r("TentacledPart2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "TentacledPart2": o([
        { json: "mCeiling", js: "mCeiling", typ: u(undefined, 0) },
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "parts", js: "parts", typ: u(undefined, a(r("ModifiedCastRangePart"))) },
    ], false),
    "TFT15LeeSinSpellReaperStance": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LeeSinSpellReaperStanceCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LeeSinSpellReaperStanceCalculations": o([
        { json: "ModifiedStrikeDamage", js: "ModifiedStrikeDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedAOEDamage", js: "ModifiedAOEDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedShockwaveDamage", js: "ModifiedShockwaveDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15LeeSinSpellTankStance": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LeeSinSpellTankStanceCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LeeSinSpellTankStanceCalculations": o([
        { json: "ModifiedInitialDamage", js: "ModifiedInitialDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedFinalDamage", js: "ModifiedFinalDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAllEnemiesDamage", js: "ModifiedAllEnemiesDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15LuluSpellKogMaw": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LuluSpellKogMawCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LuluSpellKogMawCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedExtraProjectileDamage", js: "ModifiedExtraProjectileDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15LuluSpellRammus": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LuluSpellRammusCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LuluSpellRammusCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "TotalShieldValue", js: "TotalShieldValue", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15LuluSpellSmolder": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15LuluSpellSmolderCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15LuluSpellSmolderCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("CurrentAutoDamage"))) },
        { json: "ModifiedEmberDamage", js: "ModifiedEmberDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15MalphiteSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15MalphiteSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15MalphiteSpellHeroCalculations": o([
        { json: "ModifiedRange", js: "ModifiedRange", typ: u(undefined, a(r("ModifiedNumPageElement"))) },
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15MalzaharSpellVisualMIS": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15MalzaharSpellVisualMISCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15MalzaharSpellVisualMISCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15NeekoSpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15NeekoSpellCarryCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15NeekoSpellCarryCalculations": o([
        { json: "ModifiedHeal", js: "ModifiedHeal", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15RyzeSpellTransform": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15RyzeSpellTransformCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15RyzeSpellTransformCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedAdditionalDamage", js: "ModifiedAdditionalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedHeal", js: "ModifiedHeal", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedWaveDamage", js: "ModifiedWaveDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "TFT15ShenSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15ShenSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15ShenSpellHeroCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "TFT15UdyrSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15UdyrSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15UdyrSpellHeroCalculations": o([
        { json: "ModifiedArcDamage", js: "ModifiedArcDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "TFT15UdyrSpellHeroTransform": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15UdyrSpellHeroTransformCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15UdyrSpellHeroTransformCalculations": o([
        { json: "ModifiedAS", js: "ModifiedAS", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedArcDamage", js: "ModifiedArcDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedFirestormDamage", js: "ModifiedFirestormDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "CurrentAutoDamage", js: "CurrentAutoDamage", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
        { json: "AS", js: "AS", typ: u(undefined, a(r("ModifiedActiveDamage"))) },
        { json: "FirestormBase", js: "FirestormBase", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15UdyrSpellTransform": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15UdyrSpellTransformCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15UdyrSpellTransformCalculations": o([
        { json: "ModifiedHealing", js: "ModifiedHealing", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAOEDamage", js: "ModifiedAOEDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedFlamestormDamage", js: "ModifiedFlamestormDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15ViSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15ViSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15ViSpellHeroCalculations": o([
        { json: "ModifiedSecondaryDamage", js: "ModifiedSecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "TFT15YasuoSpellTransform": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15YasuoSpellTransformCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15YasuoSpellTransformCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedTransformDamage", js: "ModifiedTransformDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT15ZacSpellHero": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT15ZacSpellHeroCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a("any")) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT15ZacSpellHeroCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedBigDamage", js: "ModifiedBigDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedManaPerSecond", js: "ModifiedManaPerSecond", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "Tft16AtakhanSpellTier": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16AtakhanSpellTier1Calculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("TFT16AtakhanSpellTier1TooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
    ], false),
    "TFT16AtakhanSpellTier1Calculations": o([
        { json: "ModifiedCleaveDamage", js: "ModifiedCleaveDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{167b6714}", js: "{167b6714}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{f751aa80}", js: "{f751aa80}", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "TotalDotDamage", js: "TotalDotDamage", typ: u(undefined, a(r("TotalDotDamage"))) },
    ], false),
    "TFT16AtakhanSpellTier1TooltipElement": o([
        { json: "type", js: "type", typ: u(undefined, r("TooltipElementType")) },
        { json: "multiplier", js: "multiplier", typ: u(undefined, 0) },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, r("NameOverride")) },
        { json: "Style", js: "Style", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "TFT16BlitzcrankSpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16BlitzcrankSpellCarryCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
    ], false),
    "TFT16BlitzcrankSpellCarryCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "{bed1fbfa}", js: "{bed1fbfa}", typ: u(undefined, a(r("ModifiedRange"))) },
        { json: "ModifiedAttackSpeed", js: "ModifiedAttackSpeed", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT16ChoGathHeroSpell": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16ChoGathHeroSpellCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("TFT16ChoGathHeroSpellTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT16ChoGathHeroSpellCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "TFT16ChoGathHeroSpellTooltipElement": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
    ], false),
    "TFT16IllaoiSpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16IllaoiSpellCarryCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
    ], false),
    "TFT16IllaoiSpellCarryCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT16KaisaSpellAP": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16KaisaSpellAPCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "TFT16KaisaSpellAPCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedSecondaryDamage", js: "ModifiedSecondaryDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT16LucianSpellSenna": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16LucianSpellSennaCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT16LucianSpellSennaCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedShield", js: "ModifiedShield", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
    ], false),
    "TFT16RumbleSpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16RumbleSpellCarryCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT16RumbleSpellCarryCalculations": o([
        { json: "ModifiedDamage", js: "ModifiedDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "TotalNumShots", js: "TotalNumShots", typ: u(undefined, a(r("FluffyTotalNumShot"))) },
        { json: "{5a92690e}", js: "{5a92690e}", typ: u(undefined, a(r("ModifiedNumTarget"))) },
    ], false),
    "FluffyTotalNumShot": o([
        { json: "type", js: "type", typ: u(undefined, r("TotalArrowType")) },
        { json: "parts", js: "parts", typ: u(undefined, a(r("FluffyPart"))) },
    ], false),
    "FluffyPart": o([
        { json: "type", js: "type", typ: u(undefined, "") },
        { json: "part1", js: "part1", typ: u(undefined, r("StickyPart1")) },
        { json: "part2", js: "part2", typ: u(undefined, r("PurplePart2")) },
        { json: "name", js: "name", typ: u(undefined, "") },
    ], false),
    "StickyPart1": o([
        { json: "type", js: "type", typ: u(undefined, r("BattleBonusBlinkDamageType")) },
        { json: "part1", js: "part1", typ: u(undefined, r("ModifiedNumSpark")) },
        { json: "part2", js: "part2", typ: u(undefined, r("Part1Part2")) },
    ], false),
    "Tft16SpellCarry": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16ChoGathHeroSpellCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
    ], false),
    "TFT16ViegoSpellRuinedKing": o([
        { json: "calculations", js: "calculations", typ: u(undefined, r("TFT16ViegoSpellRuinedKingCalculations")) },
        { json: "tooltipElements", js: "tooltipElements", typ: u(undefined, a(r("AbilityTooltipElement"))) },
        { json: "variables", js: "variables", typ: u(undefined, a(r("Variable"))) },
        { json: "apiName", js: "apiName", typ: u(undefined, "") },
        { json: "nameOverride", js: "nameOverride", typ: u(undefined, "") },
        { json: "descOverride", js: "descOverride", typ: u(undefined, "") },
        { json: "desc", js: "desc", typ: u(undefined, "") },
    ], false),
    "TFT16ViegoSpellRuinedKingCalculations": o([
        { json: "TotalDamage", js: "TotalDamage", typ: u(undefined, a(r("AdditionalDamage"))) },
        { json: "ModifiedStackingDamage", js: "ModifiedStackingDamage", typ: u(undefined, a(r("AdDamagePerArrowDisplayOnly"))) },
        { json: "ModifiedAttackSpeed", js: "ModifiedAttackSpeed", typ: u(undefined, a(r("ModifiedCastSnipTime"))) },
        { json: "{62eb5147}", js: "{62eb5147}", typ: u(undefined, a(r("AdditionalDamage"))) },
    ], false),
    "Set15MechanicHeroClass": o([
        { json: "Primary", js: "Primary", typ: u(undefined, a("")) },
        { json: "Secondary", js: "Secondary", typ: u(undefined, a("")) },
    ], false),
    "Stats": o([
        { json: "armor", js: "armor", typ: u(undefined, u(0, null)) },
        { json: "attackSpeed", js: "attackSpeed", typ: u(undefined, u(3.14, null)) },
        { json: "critChance", js: "critChance", typ: u(undefined, u(3.14, null)) },
        { json: "critMultiplier", js: "critMultiplier", typ: u(undefined, 3.14) },
        { json: "damage", js: "damage", typ: u(undefined, u(0, null)) },
        { json: "hp", js: "hp", typ: u(undefined, u(0, null)) },
        { json: "initialMana", js: "initialMana", typ: u(undefined, 0) },
        { json: "magicResist", js: "magicResist", typ: u(undefined, u(0, null)) },
        { json: "mana", js: "mana", typ: u(undefined, 0) },
        { json: "range", js: "range", typ: u(undefined, 0) },
    ], false),
    "UnitUnitProperties": o([
        { json: "TFT15_BattleAcademia_Caitlyn_FullPotential_TRA", js: "TFT15_BattleAcademia_Caitlyn_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Ezreal_FullPotential_TRA", js: "TFT15_BattleAcademia_Ezreal_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Garen_FullPotential_TRA", js: "TFT15_BattleAcademia_Garen_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Jayce_FullPotential_TRA", js: "TFT15_BattleAcademia_Jayce_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Katarina_FullPotential_TRA", js: "TFT15_BattleAcademia_Katarina_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Leona_FullPotential_TRA", js: "TFT15_BattleAcademia_Leona_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Rakan_FullPotential_TRA", js: "TFT15_BattleAcademia_Rakan_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT15_BattleAcademia_Yuumi_FullPotential_TRA", js: "TFT15_BattleAcademia_Yuumi_FullPotential_TRA", typ: u(undefined, "") },
        { json: "TFT16_DravenTakedownsRemaining", js: "TFT16_DravenTakedownsRemaining", typ: u(undefined, 0) },
    ], false),
    "Unlock": o([
        { json: "manual_conditions", js: "manual_conditions", typ: u(undefined, "") },
        { json: "conditions", js: "conditions", typ: u(undefined, a(r("Condition"))) },
        { json: "levelRequired", js: "levelRequired", typ: u(undefined, 0) },
    ], false),
    "Condition": o([
        { json: "traits", js: "traits", typ: u(undefined, a(r("ConditionTrait"))) },
        { json: "{2bbbc039}", js: "{2bbbc039}", typ: u(undefined, 0) },
        { json: "{9631656f}", js: "{9631656f}", typ: u(undefined, a(0)) },
        { json: "{03d6a5a2}", js: "{03d6a5a2}", typ: u(undefined, "") },
        { json: "DescriptionTra", js: "DescriptionTra", typ: u(undefined, "") },
        { json: "__type", js: "__type", typ: u(undefined, r("ConditionType")) },
        { json: "description", js: "description", typ: u(undefined, "") },
        { json: "milestoneName", js: "milestoneName", typ: u(undefined, "") },
        { json: "{9c2c3852}", js: "{9c2c3852}", typ: u(undefined, "") },
        { json: "{f60220b1}", js: "{f60220b1}", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "Trait", js: "Trait", typ: u(undefined, "") },
        { json: "{241519e9}", js: "{241519e9}", typ: u(undefined, 0) },
        { json: "{cfa2b9d6}", js: "{cfa2b9d6}", typ: u(undefined, r("Cfa2B9D6")) },
        { json: "CharacterRecord", js: "CharacterRecord", typ: u(undefined, "") },
        { json: "{31af55e6}", js: "{31af55e6}", typ: u(undefined, 0) },
    ], false),
    "ConditionTrait": o([
        { json: "Trait", js: "Trait", typ: u(undefined, "") },
        { json: "__type", js: "__type", typ: u(undefined, "") },
    ], false),
    "Cfa2B9D6": o([
        { json: "Item", js: "Item", typ: u(undefined, "") },
        { json: "__type", js: "__type", typ: u(undefined, r("Cfa2B9D6Type")) },
        { json: "{d39d85bd}", js: "{d39d85bd}", typ: u(undefined, "") },
        { json: "CharacterRecord", js: "CharacterRecord", typ: u(undefined, "") },
        { json: "{1996c599}", js: "{1996c599}", typ: u(undefined, 0) },
    ], false),
    "CompsData": o([
        { json: "results", js: "results", typ: u(undefined, r("CompsDataResults")) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, u(0, "")) },
        { json: "cluster_id", js: "cluster_id", typ: u(undefined, 0) },
    ], false),
    "CompsDataResults": o([
        { json: "data", js: "data", typ: u(undefined, r("Data")) },
        { json: "games", js: "games", typ: u(undefined, m(a(r("OverallValue")))) },
    ], false),
    "Data": o([
        { json: "cluster_id", js: "cluster_id", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "cluster_details", js: "cluster_details", typ: u(undefined, m(r("ClusterDetail"))) },
        { json: "portals", js: "portals", typ: u(undefined, a(r("DataPortal"))) },
    ], false),
    "ClusterDetail": o([
        { json: "Cluster", js: "Cluster", typ: u(undefined, 0) },
        { json: "centroid", js: "centroid", typ: u(undefined, a(3.14)) },
        { json: "units_string", js: "units_string", typ: u(undefined, "") },
        { json: "traits_string", js: "traits_string", typ: u(undefined, "") },
        { json: "name", js: "name", typ: u(undefined, a(r("Name"))) },
        { json: "name_string", js: "name_string", typ: u(undefined, "") },
        { json: "top_headliner", js: "top_headliner", typ: u(undefined, a("any")) },
        { json: "overall", js: "overall", typ: u(undefined, r("OverallValue")) },
        { json: "stars", js: "stars", typ: u(undefined, a("")) },
        { json: "stars_4", js: "stars_4", typ: u(undefined, a("any")) },
        { json: "builds", js: "builds", typ: u(undefined, a(r("Build"))) },
        { json: "build_items", js: "build_items", typ: u(undefined, r("BuildItems")) },
        { json: "top_itemNames", js: "top_itemNames", typ: u(undefined, a(r("Tft15ItemBastionEmblemItem"))) },
        { json: "top_items", js: "top_items", typ: u(undefined, a("any")) },
        { json: "trends", js: "trends", typ: u(undefined, a(r("Trend"))) },
        { json: "top_augments", js: "top_augments", typ: u(undefined, a("any")) },
        { json: "diff_pick", js: "diff_pick", typ: u(undefined, u(3.14, null)) },
        { json: "diff_place", js: "diff_place", typ: u(undefined, u(3.14, null)) },
        { json: "difficulty", js: "difficulty", typ: u(undefined, 3.14) },
        { json: "levelling", js: "levelling", typ: u(undefined, r("Levelling")) },
    ], false),
    "BuildItems": o([
        { json: "TFT_Item_JeweledGauntlet", js: "TFT_Item_JeweledGauntlet", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_ArchangelsStaff", js: "TFT_Item_ArchangelsStaff", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_TitansResolve", js: "TFT_Item_TitansResolve", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_GuardianAngel", js: "TFT_Item_GuardianAngel", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_GargoyleStoneplate", js: "TFT_Item_GargoyleStoneplate", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_SpearOfShojin", js: "TFT_Item_SpearOfShojin", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_InfinityEdge", js: "TFT_Item_InfinityEdge", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_RedBuff", js: "TFT_Item_RedBuff", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_DragonsClaw", js: "TFT_Item_DragonsClaw", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_StatikkShiv", js: "TFT_Item_StatikkShiv", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Deathblade", js: "TFT_Item_Deathblade", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_UnstableConcoction", js: "TFT_Item_UnstableConcoction", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Bloodthirster", js: "TFT_Item_Bloodthirster", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_GuinsoosRageblade", js: "TFT_Item_GuinsoosRageblade", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_SteraksGage", js: "TFT_Item_SteraksGage", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_SpectralGauntlet", js: "TFT_Item_SpectralGauntlet", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_WarmogsArmor", js: "TFT_Item_WarmogsArmor", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_BrambleVest", js: "TFT_Item_BrambleVest", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_MadredsBloodrazor", js: "TFT_Item_MadredsBloodrazor", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_IonicSpark", js: "TFT_Item_IonicSpark", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_PowerGauntlet", js: "TFT_Item_PowerGauntlet", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_BlueBuff", js: "TFT_Item_BlueBuff", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_NightHarvester", js: "TFT_Item_NightHarvester", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_RunaansHurricane", js: "TFT_Item_RunaansHurricane", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_LastWhisper", js: "TFT_Item_LastWhisper", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Redemption", js: "TFT_Item_Redemption", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT15_Item_SoulFighterEmblemItem", js: "TFT15_Item_SoulFighterEmblemItem", typ: u(undefined, r("ItemName")) },
        { json: "TFT_Item_RapidFireCannon", js: "TFT_Item_RapidFireCannon", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_RabadonsDeathcap", js: "TFT_Item_RabadonsDeathcap", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Morellonomicon", js: "TFT_Item_Morellonomicon", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_FrozenHeart", js: "TFT_Item_FrozenHeart", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT15_Item_BastionEmblemItem", js: "TFT15_Item_BastionEmblemItem", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Leviathan", js: "TFT_Item_Leviathan", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_HextechGunblade", js: "TFT_Item_HextechGunblade", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT15_RoboRanger_Core", js: "TFT15_RoboRanger_Core", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT15_RoboRanger_Sword", js: "TFT15_RoboRanger_Sword", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_Crownguard", js: "TFT_Item_Crownguard", typ: u(undefined, r("ItemName")) },
        { json: "TFT_Item_Quicksilver", js: "TFT_Item_Quicksilver", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_AdaptiveHelm", js: "TFT_Item_AdaptiveHelm", typ: u(undefined, r("NumItem")) },
        { json: "TFT15_RoboRanger_Slicer", js: "TFT15_RoboRanger_Slicer", typ: u(undefined, r("ItemName")) },
        { json: "TFT15_Item_HeavyweightEmblemItem", js: "TFT15_Item_HeavyweightEmblemItem", typ: u(undefined, r("ItemName")) },
        { json: "TFT15_Item_JuggernautEmblemItem", js: "TFT15_Item_JuggernautEmblemItem", typ: u(undefined, r("NumItem")) },
        { json: "TFT16_Item_Bilgewater_LuckyEyepatch", js: "TFT16_Item_Bilgewater_LuckyEyepatch", typ: u(undefined, r("NumItem")) },
        { json: "TFT16_Item_Bilgewater_FreebootersFrock", js: "TFT16_Item_Bilgewater_FreebootersFrock", typ: u(undefined, r("NumItem")) },
        { json: "TFT16_Item_Bilgewater_FirstMatesFlintlock", js: "TFT16_Item_Bilgewater_FirstMatesFlintlock", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT16_Item_Bilgewater_BilgeratCutlass", js: "TFT16_Item_Bilgewater_BilgeratCutlass", typ: u(undefined, r("NumItem")) },
        { json: "TFT16_Item_Bilgewater_BlackmarketExplosives", js: "TFT16_Item_Bilgewater_BlackmarketExplosives", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT16_Item_SlayerEmblemItem", js: "TFT16_Item_SlayerEmblemItem", typ: u(undefined, r("NumItem")) },
        { json: "TFT16_Item_DemaciaEmblemItem", js: "TFT16_Item_DemaciaEmblemItem", typ: u(undefined, r("NumItem")) },
        { json: "TFT15_Item_ChallengerEmblemItem", js: "TFT15_Item_ChallengerEmblemItem", typ: u(undefined, r("Tft15ItemBastionEmblemItem")) },
        { json: "TFT_Item_ThiefsGloves", js: "TFT_Item_ThiefsGloves", typ: u(undefined, r("ItemName")) },
        { json: "TFT16_Item_Bilgewater_PileOCitrus", js: "TFT16_Item_Bilgewater_PileOCitrus", typ: u(undefined, r("ItemName")) },
        { json: "TFT16_Item_RapidfireEmblemItem", js: "TFT16_Item_RapidfireEmblemItem", typ: u(undefined, r("NumItem")) },
    ], false),
    "Tft15ItemBastionEmblemItem": o([
        { json: "itemNames", js: "itemNames", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
        { json: "pcnt", js: "pcnt", typ: u(undefined, 3.14) },
        { json: "units", js: "units", typ: u(undefined, a(r("ItemNameUnit"))) },
        { json: "num_items", js: "num_items", typ: u(undefined, 0) },
        { json: "tier", js: "tier", typ: u(undefined, 0) },
    ], false),
    "Name": o([
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("NameType")) },
        { json: "score", js: "score", typ: u(undefined, 3.14) },
    ], false),
    "DataPortal": o([
        { json: "portal", js: "portal", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
        { json: "place_sum", js: "place_sum", typ: u(undefined, 0) },
        { json: "comps", js: "comps", typ: u(undefined, a(r("Comp"))) },
        { json: "pickrate", js: "pickrate", typ: u(undefined, 3.14) },
        { json: "avg", js: "avg", typ: u(undefined, 3.14) },
    ], false),
    "Comp": o([
        { json: "c", js: "c", typ: u(undefined, "") },
        { json: "a_diff", js: "a_diff", typ: u(undefined, 3.14) },
        { json: "cnt", js: "cnt", typ: u(undefined, 0) },
        { json: "p_chng", js: "p_chng", typ: u(undefined, 3.14) },
    ], false),
    "Items": [
        "TFT_Item_BFSword",
        "TFT_Item_ChainVest",
        "TFT_Item_FryingPan",
        "TFT_Item_GiantsBelt",
        "TFT_Item_NeedlesslyLargeRod",
        "TFT_Item_NegatronCloak",
        "TFT_Item_RecurveBow",
        "TFT_Item_SparringGloves",
        "TFT_Item_Spatula",
        "TFT_Item_TearOfTheGoddess",
    ],
    "Units": [
        "TFT15_Braum",
        "TFT15_Darius",
        "TFT15_Jhin",
        "TFT15_KSante",
        "TFT15_Malzahar",
        "TFT15_Neeko",
        "TFT15_Poppy",
        "TFT15_Rakan",
        "TFT15_Rammus",
        "TFT15_Seraphine",
        "TFT15_Syndra",
        "TFT15_TwistedFate",
        "TFT15_Varus",
        "TFT15_Yuumi",
        "TFT15_Zac",
    ],
    "Cell": [
        "cell_1",
        "cell_10",
        "cell_11",
        "cell_12",
        "cell_14",
        "cell_16",
        "cell_17",
        "cell_18",
        "cell_19",
        "cell_2",
        "cell_22",
        "cell_23",
        "cell_24",
        "cell_25",
        "cell_26",
        "cell_27",
        "cell_28",
        "cell_3",
        "cell_4",
        "cell_5",
        "cell_6",
        "cell_7",
    ],
    "VariableMatchType": [
        "multiplier",
        "variable",
    ],
    "AugmentEnum": [
        "Tier1",
        "Tier2",
        "Tier3",
    ],
    "AugmentTag": [
        "{b72bd3bf}",
        "{ce1fd21c}",
        "{cf1fd3af}",
        "{d02ae323}",
        "{d11fd6d5}",
        "{d12ae4b6}",
        "{d22ae649}",
        "{d79fb940}",
        "{ec068228}",
        "2-1",
        "3-2",
        "{3754d0ae}",
        "{37baee9b}",
        "{38baf02e}",
        "{39baf1c1}",
        "{3ea7328b}",
        "4-2",
        "{4529fead}",
        "{758ad473}",
        "{7aaa3b47}",
        "{84a6d904}",
        "{8fba48a3}",
        "{92e7310e}",
    ],
    "AugmentType": [
        "regular",
    ],
    "EncounterTag": [
        "{cc9fe568}",
        "{e6512306}",
        "{f2196170}",
        "{42a85b31}",
        "{5b754253}",
    ],
    "AssociatedTrait": [
        "TFT15_Duelist",
        "TFT15_Mecha",
        "TFT16_Bilgewater",
    ],
    "ItemTag": [
        "Artifact",
        "Consumable",
        "{d8d00bcc}",
        "{e8cbf2d4}",
        "Emblem",
        "Support",
    ],
    "MBuffName": [
        "{e7b3aa56}",
        "{3d91cbb4}",
    ],
    "TotalArrowType": [
        "BuffCounterByNamedDataValueCalculationPart",
        "multiplier",
        "NamedDataValueCalculationPart",
        "StatByNamedDataValueCalculationPart",
        "StatBySubPartCalculationPart",
        "SubPartScaledProportionalToStat",
        "SumOfSubPartsCalculationPart",
    ],
    "ModifiedBonusADType": [
        "BuffCounterByCoefficientCalculationPart",
        "BuffCounterByNamedDataValueCalculationPart",
        "NamedDataValueCalculationPart",
        "StatByCoefficientCalculationPart",
    ],
    "ModifiedAcidDamageType": [
        "{f3cbe7b2}",
        "multiplier",
        "SumOfSubPartsCalculationPart",
    ],
    "BattleBonusBlinkDamageType": [
        "ProductOfSubPartsCalculationPart",
        "SumOfSubPartsCalculationPart",
    ],
    "CurrentAutoDamageType": [
        "NamedDataValueCalculationPart",
        "StatByCoefficientCalculationPart",
        "StatByNamedDataValueCalculationPart",
    ],
    "PurpleType": [
        "NamedDataValueCalculationPart",
        "NumberCalculationPart",
        "StatByCoefficientCalculationPart",
    ],
    "FluffyType": [
        "ExponentSubPartsCalculationPart",
    ],
    "NameOverride": [
        "Spell_TFT16_AtakhanSpell_CleaveDamage",
        "Spell_TFT16_AtakhanSpell_DOTDamage",
        "Spell_TFT16_AtakhanSpell_Omnivamp",
    ],
    "TooltipElementType": [
        "CleaveDamage",
        "DOTDamage",
        "Omnivamp",
    ],
    "ConditionType": [
        "{a630a690}",
        "{bb04e22d}",
        "{f9983033}",
        "{29124137}",
    ],
    "Cfa2B9D6Type": [
        "{c9feb84a}",
        "{08b0381c}",
        "{3a3de0cc}",
    ],
    "Levelling": [
        "Fast 8",
        "Fast 9",
        "lvl 5",
        "lvl 6",
        "lvl 7",
        "Standard",
    ],
    "NameType": [
        "trait",
        "unit",
    ],
};
