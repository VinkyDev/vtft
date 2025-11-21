// To parse this data:
//
//   import { Convert, Units, Augments, Items, Traits } from "./file";
//
//   const units = Convert.toUnits(json);
//   const augments = Convert.toAugments(json);
//   const items = Convert.toItems(json);
//   const traits = Convert.toTraits(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

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
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toUnits(json: string): Units {
        return cast(JSON.parse(json), r("Units"));
    }

    public static unitsToJson(value: Units): string {
        return JSON.stringify(uncast(value, r("Units")), null, 2);
    }

    public static toAugments(json: string): Augments {
        return cast(JSON.parse(json), r("Augments"));
    }

    public static augmentsToJson(value: Augments): string {
        return JSON.stringify(uncast(value, r("Augments")), null, 2);
    }

    public static toItems(json: string): Items {
        return cast(JSON.parse(json), r("Items"));
    }

    public static itemsToJson(value: Items): string {
        return JSON.stringify(uncast(value, r("Items")), null, 2);
    }

    public static toTraits(json: string): Traits {
        return cast(JSON.parse(json), r("Traits"));
    }

    public static traitsToJson(value: Traits): string {
        return JSON.stringify(uncast(value, r("Traits")), null, 2);
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
    "Units": o([
        { json: "results", js: "results", typ: u(undefined, a(r("UnitsResult"))) },
        { json: "games", js: "games", typ: u(undefined, a(r("Game"))) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, "") },
    ], false),
    "Game": o([
        { json: "patch", js: "patch", typ: u(undefined, "") },
        { json: "b_patch_version", js: "b_patch_version", typ: u(undefined, "") },
        { json: "count", js: "count", typ: u(undefined, 0) },
    ], false),
    "UnitsResult": o([
        { json: "unit", js: "unit", typ: u(undefined, "") },
        { json: "places", js: "places", typ: u(undefined, a(0)) },
    ], false),
    "Augments": o([
        { json: "tags", js: "tags", typ: u(undefined, r("Tags")) },
        { json: "content", js: "content", typ: u(undefined, r("AugmentsContent")) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, 0) },
    ], false),
    "AugmentsContent": o([
        { json: "author", js: "author", typ: u(undefined, r("Author")) },
        { json: "content", js: "content", typ: u(undefined, r("ContentContent")) },
        { json: "created_at", js: "created_at", typ: u(undefined, Date) },
        { json: "updated_at", js: "updated_at", typ: u(undefined, Date) },
        { json: "content_id", js: "content_id", typ: u(undefined, "") },
    ], false),
    "Author": o([
        { json: "platform", js: "platform", typ: u(undefined, "") },
        { json: "puuid", js: "puuid", typ: u(undefined, "") },
        { json: "gameName", js: "gameName", typ: u(undefined, "") },
        { json: "tagLine", js: "tagLine", typ: u(undefined, "") },
    ], false),
    "ContentContent": o([
        { json: "tierList", js: "tierList", typ: u(undefined, a(r("TierList"))) },
        { json: "tierListType", js: "tierListType", typ: u(undefined, "") },
        { json: "notes", js: "notes", typ: u(undefined, m("")) },
        { json: "tags", js: "tags", typ: u(undefined, m("")) },
    ], false),
    "TierList": o([
        { json: "content", js: "content", typ: u(undefined, a(r("ContentElement"))) },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "color", js: "color", typ: u(undefined, "") },
    ], false),
    "ContentElement": o([
        { json: "id", js: "id", typ: u(undefined, "") },
        { json: "type", js: "type", typ: u(undefined, r("Type")) },
    ], false),
    "Tags": o([
    ], false),
    "Items": o([
        { json: "results", js: "results", typ: u(undefined, a(r("ItemsResult"))) },
        { json: "games", js: "games", typ: u(undefined, a(r("Game"))) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, "") },
    ], false),
    "ItemsResult": o([
        { json: "itemName", js: "itemName", typ: u(undefined, "") },
        { json: "places", js: "places", typ: u(undefined, a(0)) },
    ], false),
    "Traits": o([
        { json: "results", js: "results", typ: u(undefined, a(r("TraitsResult"))) },
        { json: "games", js: "games", typ: u(undefined, a(r("Game"))) },
        { json: "updated", js: "updated", typ: u(undefined, 0) },
        { json: "tft_set", js: "tft_set", typ: u(undefined, "") },
        { json: "queue_id", js: "queue_id", typ: u(undefined, "") },
    ], false),
    "TraitsResult": o([
        { json: "trait", js: "trait", typ: u(undefined, "") },
        { json: "places", js: "places", typ: u(undefined, a(0)) },
    ], false),
    "Type": [
        "augment",
    ],
};
