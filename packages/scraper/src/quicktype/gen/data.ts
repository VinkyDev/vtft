// To parse this data:
//
//   import { Convert, Units, Augments, Items, Traits } from "./file";
//
//   const units = Convert.toUnits(json);
//   const augments = Convert.toAugments(json);
//   const items = Convert.toItems(json);
//   const traits = Convert.toTraits(json);

export interface Units {
    results?:  UnitsResult[];
    games?:    Game[];
    updated?:  number;
    tft_set?:  string;
    queue_id?: string;
}

export interface Game {
    patch?:           string;
    b_patch_version?: string;
    count?:           number;
}

export interface UnitsResult {
    unit?:   string;
    places?: number[];
}

export interface Augments {
    tags?:     Tags;
    content?:  AugmentsContent;
    updated?:  number;
    tft_set?:  string;
    queue_id?: number;
}

export interface AugmentsContent {
    author?:     Author;
    content?:    ContentContent;
    created_at?: Date;
    updated_at?: Date;
    content_id?: string;
}

export interface Author {
    platform?: string;
    puuid?:    string;
    gameName?: string;
    tagLine?:  string;
}

export interface ContentContent {
    tierList?:     TierList[];
    tierListType?: string;
    notes?:        { [key: string]: string };
    tags?:         { [key: string]: string };
}

export interface TierList {
    content?: ContentElement[];
    label?:   string;
    color?:   string;
}

export interface ContentElement {
    id?:   string;
    type?: Type;
}

export enum Type {
    Augment = "augment",
}

export interface Tags {
}

export interface Items {
    results?:  ItemsResult[];
    games?:    Game[];
    updated?:  number;
    tft_set?:  string;
    queue_id?: string;
}

export interface ItemsResult {
    itemName?: string;
    places?:   number[];
}

export interface Traits {
    results?:  TraitsResult[];
    games?:    Game[];
    updated?:  number;
    tft_set?:  string;
    queue_id?: string;
}

export interface TraitsResult {
    trait?:  string;
    places?: number[];
}

// Converts JSON strings to/from your types
export class Convert {
    public static toUnits(json: string): Units {
        return JSON.parse(json);
    }

    public static unitsToJson(value: Units): string {
        return JSON.stringify(value);
    }

    public static toAugments(json: string): Augments {
        return JSON.parse(json);
    }

    public static augmentsToJson(value: Augments): string {
        return JSON.stringify(value);
    }

    public static toItems(json: string): Items {
        return JSON.parse(json);
    }

    public static itemsToJson(value: Items): string {
        return JSON.stringify(value);
    }

    public static toTraits(json: string): Traits {
        return JSON.parse(json);
    }

    public static traitsToJson(value: Traits): string {
        return JSON.stringify(value);
    }
}
