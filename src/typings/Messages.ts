import type { Session_M } from './data/Session_M';
import type { IRoll } from './Roll';
import type { Meta } from './stores/session';

export type Message = Omit<Session_M, 'roll'> & {
	character?: string;
	flavor?: string;
	doc: Document;
	roll?: IRoll;
	diff: number;
	skip?: boolean;
	verify?: boolean;
};
export type Log = Message & {
	startTime: string;
	endTime: string;
};

export interface ROLL {
	type: 'ROLL';
	dice: string;
	roll: IRoll & {
		values: number[];
	};
}
export interface ROLL_TABLE {
	type: 'ROLL_TABLE';
	table: string;
	items: unknown[];
}
export interface IMAGE {
	type: 'IMAGE';
	character: string;
	image: string;
}
export interface TRADE {
	type: 'TRADE';
	participants: string[];
	flavor: string;
}
export interface SHOP {
	type: 'SHOP';
	shop: string;
	action: string;
	items: {
		qty: string;
		name: string;
		price: string;
	}[];
}
export interface TRANSFER {
	type: 'TRANSFER';
	target: string;
	items: string;
}
export interface COMBAT {
	type: 'COMBAT';
	time: string;
}
export interface EXP {
	type: 'EXP';
	xp: string[];
	participants: string[];
}
export interface COVER {
	type: 'COVER';
}
export interface INFO {
	type: 'INFO';
}
export interface TRAINING {
	type: 'TRAINING';
	status: string;
	training: string;
}
export interface RECAP {
	type: 'RECAP';
}

export type Parsed = Message &
	Meta &
	(
		| ROLL
		| ROLL_TABLE
		| IMAGE
		| TRADE
		| SHOP
		| TRANSFER
		| COMBAT
		| EXP
		| COVER
		| INFO
		| TRAINING
		| RECAP
	);
export function typed<T extends { type: S }, S extends string = T['type']>(
	condition: boolean,
	msg: Message,
	type?: S
): msg is Message & T {
	if (type) (msg as Message & T).type = type;
	return condition;
}
