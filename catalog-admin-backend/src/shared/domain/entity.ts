import type { ValueObject } from './value-object';

export abstract class Entity {
	abstract get entity_id(): ValueObject;
	abstract toJSON(): Record<string, unknown>;
}
