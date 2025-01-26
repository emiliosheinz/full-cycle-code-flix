import { Entity } from '../entity';
import { ValueObject } from '../value-object';
import { SearchInput } from './search-input';
import { SearchResult } from './search-result';

export interface IRespository<E extends Entity, I extends ValueObject> {
	insert(entity: E): Promise<void>;
	bulkInsert(entities: E[]): Promise<void>;
	update(entity: E): Promise<void>;
	delete(entity_id: I): Promise<void>;

	findById(entity_id: I): Promise<E | null>;
	findAll(): Promise<E[]>;

	getEntity(): new (...args: unknown[]) => E;
}

export interface ISearchableRepository<
	E extends Entity,
	I extends ValueObject,
	S extends SearchInput = SearchInput,
	R extends SearchResult = SearchResult,
> extends IRespository<E, I> {
	sortableFields: string[];
	search(props: S): Promise<R>;
}
