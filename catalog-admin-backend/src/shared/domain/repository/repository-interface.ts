import type { Entity } from '../entity';
import type { ValueObject } from '../value-object';

export interface IRespository<E extends Entity, I extends ValueObject> {
  insert(entity: E): Promise<void>;
  bulkInsert(entities: E[]): Promise<void>;
  update(entity: E): Promise<void>;
  delete(entity_id: I): Promise<void>;

  findById(entity_id: I): Promise<E | null>;
  findAll(): Promise<E[]>;

  getEntity(): new (...args: unknown[]) => E;
}

export interface ISearchableRepository<E extends Entity, I extends ValueObject, S, O>
  extends IRespository<E, I> {
  sortableFields: string[];
	search(props: S): Promise<O>;
}
