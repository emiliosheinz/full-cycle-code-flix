import type { Entity } from '../entity';
import type { ValueObject } from '../value-object';

export class NotFoundError extends Error {
  constructor(
    id: ValueObject[] | ValueObject,
    entityClass: Entity,
  ) {
    const ids = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityClass.name} with id ${ids} does not exist`);
    this.name = 'NotFoundError';
  }
}
