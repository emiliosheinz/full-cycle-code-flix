import { faker } from '@faker-js/faker';
import { Entity } from '../../domain/entity';
import { Uuid } from '../../domain/value-objects/uuid.vo';
import { ValueObject } from '../../domain/value-object';
import { InMemorySearchableRepository } from './in-memory.repository';
import { SearchInput } from '../../domain/repository/search-input';
import { SearchResult } from '../../domain/repository/search-result';

class StubEntity extends Entity {
	id: Uuid = new Uuid();
	name = faker.person.fullName();
	price = faker.commerce.price();

	get entity_id(): ValueObject {
		return this.id;
	}

	toJSON(): Record<string, unknown> {
		return {
			id: this.id.id,
			name: this.name,
		};
	}
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
	StubEntity,
	Uuid,
	SearchInput<string>
> {
	sortableFields = ['name'];

	getEntity(): new (...args: unknown[]) => StubEntity {
		return StubEntity;
	}

	protected async applyFilter(
		items: StubEntity[],
		filter: string | null,
	): Promise<StubEntity[]> {
		if (!filter) {
			return items;
		}

		return items.filter(
			(item) =>
				item.name.toLowerCase().includes(filter.toLowerCase()) ||
				item.price === filter,
		);
	}
}

describe('InMemorySearchableRepository', () => {
	let repository: StubInMemorySearchableRepository;

	beforeEach(() => {
		repository = new StubInMemorySearchableRepository();
	});

	describe('applyFilter', () => {
		test('should not filter items when filter is null', async () => {
			const entities = Array.from({ length: 3 }, () => new StubEntity());

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			const items = await repository['applyFilter'](entities, null);

			expect(items).toHaveLength(3);
			expect(items).toEqual(entities);
		});

		test('should apply the filter parameter', async () => {
			const entities = Array.from({ length: 3 }, () => new StubEntity());
			const firstEntity = entities[0];

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			const items = await repository['applyFilter'](entities, firstEntity.name);

			expect(items).toHaveLength(1);
			expect(items[0]).toEqual(firstEntity);
		});
	});

	describe('applySort', () => {
		test('should not sort items when sort is null', () => {
			const entities = Array.from({ length: 3 }, () => new StubEntity());

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			const items = repository['applySort'](entities, null, null);

			expect(items).toHaveLength(3);
			expect(items).toEqual(entities);
		});

		test('should not apply sort when field is not sortable', () => {
			const entities = Array.from({ length: 3 }, () => new StubEntity());

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			const items = repository['applySort'](entities, 'price', 'asc');

			expect(items).toHaveLength(3);
			expect(items).toEqual(entities);
		});

		test('should apply sort when field is sortable', () => {
			const entities = Array.from({ length: 3 }, () => new StubEntity());

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			const items = repository['applySort'](entities, 'name', 'asc');

			expect(items).toHaveLength(3);
			expect(items[0].name < items[1].name).toBe(true);
			expect(items[1].name < items[2].name).toBe(true);
		});
	});

	describe('applyPagination', () => {
		test('should apply pagination', () => {
			const entities = Array.from({ length: 6 }, () => new StubEntity());

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			let items = repository['applyPagination'](entities, 1, 2);
			expect(items).toHaveLength(2);
			expect(items).toEqual([entities[0], entities[1]]);

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			items = repository['applyPagination'](entities, 2, 2);
			expect(items).toHaveLength(2);
			expect(items).toEqual([entities[2], entities[3]]);

			// biome-ignore lint/complexity/useLiteralKeys: access protected method
			items = repository['applyPagination'](entities, 3, 2);
			expect(items).toHaveLength(2);
			expect(items).toEqual([entities[4], entities[5]]);
		});
	});

	describe('search', () => {
		test('should only apply paginate when other parameters are null', async () => {
			const entities = Array.from({ length: 16 }, () => new StubEntity());
			repository.bulkInsert(entities);

			const result = await repository.search(new SearchInput());

			expect(result).toEqual(
				new SearchResult({
					items: entities.slice(0, 15),
					total: 16,
					current_page: 1,
					per_page: 15,
				}),
			);
		});

		test('should apply pagination ang filter', async () => {
			const entities = Array.from({ length: 16 }, () => new StubEntity());
			repository.bulkInsert(entities);

			const result = await repository.search(
				new SearchInput({ filter: entities[0].name }),
			);

			expect(result).toEqual(
				new SearchResult({
					items: [entities[0]],
					total: 1,
					current_page: 1,
					per_page: 15,
				}),
			);
		});

		test('should apply pagination, filter, and sort', async () => {
			const entities = Array.from({ length: 30 }, (_, index) => {
				const entity = new StubEntity();
				entity.name = `entity-${index}`;
				return entity;
			});
			repository.bulkInsert(entities);

			const filterValue = 'entity-2';
			const perPage = 10;
			const currentPage = 2;

			const result = await repository.search(
				new SearchInput({
					filter: filterValue,
					sort: 'name',
					sort_dir: 'asc',
					per_page: perPage,
					page: currentPage,
				}),
			);

			const filteredEntities = entities
				.filter((entity) => entity.name.includes(filterValue))
				.sort((a, b) => a.name.localeCompare(b.name));
			const paginatedEntities = filteredEntities.slice(
				(currentPage - 1) * perPage,
				currentPage * perPage,
			);

			expect(result).toEqual(
				new SearchResult({
					items: paginatedEntities,
					total: filteredEntities.length,
					current_page: currentPage,
					per_page: perPage,
				}),
			);
		});
	});
});
