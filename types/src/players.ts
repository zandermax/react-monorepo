/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
// To parse this data:
//
//   import { Convert, Players } from "./file";
//
//   const players = Convert.toPlayers(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Players {
	data: Datum[];
	meta: Meta;
}

export interface Datum {
	id: number;
	first_name: string;
	height_feet: number | null;
	height_inches: number | null;
	last_name: string;
	position: Position;
	team: Team;
	weight_pounds: number | null;
}

export enum Position {
	C = 'C',
	CF = 'C-F',
	Empty = '',
	F = 'F',
	FC = 'F-C',
	FG = 'F-G',
	G = 'G',
	GF = 'G-F',
}

export interface Team {
	id: number;
	abbreviation: string;
	city: string;
	conference: Conference;
	division: Division;
	full_name: string;
	name: string;
}

export enum Conference {
	East = 'East',
	Empty = '    ',
	West = 'West',
}

export enum Division {
	Atlantic = 'Atlantic',
	Central = 'Central',
	Empty = '',
	Northwest = 'Northwest',
	Pacific = 'Pacific',
	Southeast = 'Southeast',
	Southwest = 'Southwest',
}

export interface Meta {
	current_page: number;
	next_page: number | null;
	per_page: number;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
	public static toPlayers(json: string): Players {
		return cast(JSON.parse(json), r('Players'));
	}

	public static playersToJson(value: Players): string {
		return JSON.stringify(uncast(value, r('Players')), null, 2);
	}
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
	const prettyTyp = prettyTypeName(typ);
	const parentText = parent ? ` on ${parent}` : '';
	const keyText = key ? ` for key "${key}"` : '';
	throw Error(
		`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(
			val
		)}`
	);
}

function prettyTypeName(typ: any): string {
	if (Array.isArray(typ)) {
		if (typ.length === 2 && typ[0] === undefined) {
			return `an optional ${prettyTypeName(typ[1])}`;
		} else {
			return `one of [${typ
				.map((a) => {
					return prettyTypeName(a);
				})
				.join(', ')}]`;
		}
	} else if (typeof typ === 'object' && typ.literal !== undefined) {
		return typ.literal;
	} else {
		return typeof typ;
	}
}

function jsonToJSProps(typ: any): any {
	if (typ.jsonToJS === undefined) {
		const map: any = {};
		typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
		typ.jsonToJS = map;
	}
	return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
	if (typ.jsToJSON === undefined) {
		const map: any = {};
		typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
		typ.jsToJSON = map;
	}
	return typ.jsToJSON;
}

function transform(
	val: any,
	typ: any,
	getProps: any,
	key: any = '',
	parent: any = ''
): any {
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
			} catch (_) {
				/* empty */
			}
		}
		return invalidValue(typs, val, key, parent);
	}

	function transformEnum(cases: string[], val: any): any {
		if (cases.indexOf(val) !== -1) return val;
		return invalidValue(
			cases.map((a) => {
				return l(a);
			}),
			val,
			key,
			parent
		);
	}

	function transformArray(typ: any, val: any): any {
		// val must be an array with no invalid elements
		if (!Array.isArray(val)) return invalidValue(l('array'), val, key, parent);
		return val.map((el) => transform(el, typ, getProps));
	}

	function transformDate(val: any): any {
		if (val === null) {
			return null;
		}
		const d = new Date(val);
		if (isNaN(d.valueOf())) {
			return invalidValue(l('Date'), val, key, parent);
		}
		return d;
	}

	function transformObject(
		props: { [k: string]: any },
		additional: any,
		val: any
	): any {
		if (val === null || typeof val !== 'object' || Array.isArray(val)) {
			return invalidValue(l(ref || 'object'), val, key, parent);
		}
		const result: any = {};
		Object.getOwnPropertyNames(props).forEach((key) => {
			const prop = props[key];
			const v = Object.prototype.hasOwnProperty.call(val, key)
				? val[key]
				: undefined;
			result[prop.key] = transform(v, prop.typ, getProps, key, ref);
		});
		Object.getOwnPropertyNames(val).forEach((key) => {
			if (!Object.prototype.hasOwnProperty.call(props, key)) {
				result[key] = transform(val[key], additional, getProps, key, ref);
			}
		});
		return result;
	}

	if (typ === 'any') return val;
	if (typ === null) {
		if (val === null) return val;
		return invalidValue(typ, val, key, parent);
	}
	if (typ === false) return invalidValue(typ, val, key, parent);
	let ref: any = undefined;
	while (typeof typ === 'object' && typ.ref !== undefined) {
		ref = typ.ref;
		typ = typeMap[typ.ref];
	}
	if (Array.isArray(typ)) return transformEnum(typ, val);
	if (typeof typ === 'object') {
		return typ.hasOwnProperty('unionMembers')
			? transformUnion(typ.unionMembers, val)
			: typ.hasOwnProperty('arrayItems')
			? transformArray(typ.arrayItems, val)
			: typ.hasOwnProperty('props')
			? transformObject(getProps(typ), typ.additional, val)
			: invalidValue(typ, val, key, parent);
	}
	// Numbers can be parsed by Date but shouldn't be.
	if (typ === Date && typeof val !== 'number') return transformDate(val);
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
	Players: o(
		[
			{ json: 'data', js: 'data', typ: a(r('Datum')) },
			{ json: 'meta', js: 'meta', typ: r('Meta') },
		],
		false
	),
	Datum: o(
		[
			{ json: 'id', js: 'id', typ: 0 },
			{ json: 'first_name', js: 'first_name', typ: '' },
			{ json: 'height_feet', js: 'height_feet', typ: u(0, null) },
			{ json: 'height_inches', js: 'height_inches', typ: u(0, null) },
			{ json: 'last_name', js: 'last_name', typ: '' },
			{ json: 'position', js: 'position', typ: r('Position') },
			{ json: 'team', js: 'team', typ: r('Team') },
			{ json: 'weight_pounds', js: 'weight_pounds', typ: u(0, null) },
		],
		false
	),
	Team: o(
		[
			{ json: 'id', js: 'id', typ: 0 },
			{ json: 'abbreviation', js: 'abbreviation', typ: '' },
			{ json: 'city', js: 'city', typ: '' },
			{ json: 'conference', js: 'conference', typ: r('Conference') },
			{ json: 'division', js: 'division', typ: r('Division') },
			{ json: 'full_name', js: 'full_name', typ: '' },
			{ json: 'name', js: 'name', typ: '' },
		],
		false
	),
	Meta: o(
		[
			{ json: 'current_page', js: 'current_page', typ: 0 },
			{ json: 'next_page', js: 'next_page', typ: u(0, null) },
			{ json: 'per_page', js: 'per_page', typ: 0 },
		],
		false
	),
	Position: ['C', 'C-F', '', 'F', 'F-C', 'F-G', 'G', 'G-F'],
	Conference: ['East', '    ', 'West'],
	Division: [
		'Atlantic',
		'Central',
		'',
		'Northwest',
		'Pacific',
		'Southeast',
		'Southwest',
	],
};
