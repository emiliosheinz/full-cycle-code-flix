import { Entity } from '../../domain/entity';
import { NotFoundError } from '../../domain/errors/not-found.error';
import {
	IRespository,
	ISearchableRepository,
} from '../../domain/repository/repository-interface';
import {
	SearchInput,
	SortDirection,
} from '../../domain/repository/search-input';
import { SearchResult } from '../../domain/repository/search-result';
import { ValueObject } from '../../domain/value-object';

export abstract class InMemoryRepository<
	E extends Entity,
	I extends ValueObject,
> implements IRespository<E, I>
{
	items: E[] = [];

	async insert(entity: E): Promise<void> {
		this.items.push(entity);
	}

	async bulkInsert(entities: E[]): Promise<void> {
		this.items.push(...entities);
	}

	async update(entity: E): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.entity_id.equals(entity.entity_id),
		);

		if (itemIndex === -1) {
			throw new NotFoundError(entity.entity_id, this.getEntity());
		}

		this.items[itemIndex] = entity;
	}

	async delete(entity_id: I): Promise<void> {
		const itemIndex = this.items.findIndex((item) =>
			item.entity_id.equals(entity_id),
		);

		if (itemIndex === -1) {
			throw new NotFoundError(entity_id, this.getEntity());
		}

		this.items.splice(itemIndex, 1);
	}

	async findById(entity_id: I): Promise<E | null> {
		const item = this.items.find((item) => item.entity_id.equals(entity_id));
		return item || null;
	}

	async findAll(): Promise<E[]> {
		return this.items;
	}

	// biome-ignore lint/suspicious/noExplicitAny: This is a generic method
	abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
		E extends Entity,
		I extends ValueObject,
		S extends SearchInput,
	>
	extends InMemoryRepository<E, I>
	implements ISearchableRepository<E, I, S, SearchResult<E>>
{
	sortableFields: string[] = [];

	async search(props: S): Promise<SearchResult<E>> {
		const filteredItems = await this.applyFilter(this.items, props.filter);
		const sortedItems = this.applySort(
			filteredItems,
			props.sort,
			props.sort_dir,
		);
		const paginatedItems = this.applyPagination(
			sortedItems,
			props.page,
			props.per_page,
		);
		return new SearchResult({
			items: paginatedItems,
			total: filteredItems.length,
			current_page: props.page,
			per_page: props.per_page,
		});
	}

	protected abstract applyFilter(items: E[], filter: S['filter']): Promise<E[]>;

	protected applyPagination(
		items: E[],
		page: S['page'],
		per_page: S['per_page'],
	): E[] {
		const start = (page - 1) * per_page;
		const end = start + per_page;
		return items.slice(start, end);
	}

	protected applySort(
		items: E[],
		sort: string | null,
		sort_dir: SortDirection | null,
		custom_getter?: (sort: string, item: E) => E[keyof E],
	): E[] {
		if (!sort || !this.sortableFields.includes(sort as string)) {
			return items;
		}

		return [...items].sort((a, b) => {
			const aValue = custom_getter
				? custom_getter(sort, a)
				: a[sort as keyof E];
			const bValue = custom_getter
				? custom_getter(sort, b)
				: b[sort as keyof E];

			if (aValue > bValue) {
				return sort_dir === 'asc' ? 1 : -1;
			}

			if (aValue < bValue) {
				return sort_dir === 'asc' ? -1 : 1;
			}

			return 0;
		});
	}
}
