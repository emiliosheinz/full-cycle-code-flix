import type { Entity } from '../entity';
import type { ValueObject } from '../value-object';

export interface IRespository<E extends Entity, I extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity: E): Promise<void>;

  findById(entity_id: I): Promise<E>;
  findAll(): Promise<E[]>;

  getEntity(): new (...args: unknown[]) => E;
}
