import { Entity } from '../entity';
import { ValueObject } from '../value-object';

export class NotFoundError extends Error {
	constructor(
		id: ValueObject[] | ValueObject,
		entityClass: new (...args: unknown[]) => Entity,
	) {
		const ids = Array.isArray(id) ? id.join(', ') : id;
		super(`${entityClass.name} with id ${ids} does not exist`);
		this.name = 'NotFoundError';
	}
}
