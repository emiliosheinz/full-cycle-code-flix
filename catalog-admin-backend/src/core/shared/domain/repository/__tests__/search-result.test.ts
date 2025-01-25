import { Entity } from '../../entity';
import type { ValueObject } from '../../value-object';
import { Uuid } from '../../value-objects/uuid.vo';
import { SearchResult } from '../search-result';

class TestEntity extends Entity {
	id: Uuid = new Uuid();

	get entity_id(): ValueObject {
		return this.id;
	}

	toJSON(): Record<string, unknown> {
		return {
			id: this.id,
		};
	}
}

describe('SearchResult', () => {
	it('should set properties correctly', () => {
		const items = [new TestEntity(), new TestEntity()];
		const total = 100;
		const current_page = 1;
		const per_page = 10;

		const searchResult = new SearchResult({
			items,
			total,
			current_page,
			per_page,
		});

		expect(searchResult.items).toBe(items);
		expect(searchResult.total).toBe(total);
		expect(searchResult.current_page).toBe(current_page);
		expect(searchResult.per_page).toBe(per_page);
		expect(searchResult.last_page).toBe(Math.ceil(total / per_page));
	});

	it('should calculate last_page correctly', () => {
		const items = [new TestEntity()];
		const total = 95;
		const current_page = 1;
		const per_page = 10;

		const searchResult = new SearchResult({
			items,
			total,
			current_page,
			per_page,
		});

		expect(searchResult.last_page).toBe(Math.ceil(total / per_page));
	});

	it('should return correct JSON representation', () => {
		const items = [new TestEntity(), new TestEntity()];
		const total = 100;
		const current_page = 1;
		const per_page = 10;

		const searchResult = new SearchResult({
			items,
			total,
			current_page,
			per_page,
		});

		const json = searchResult.toJSON();
		expect(json).toEqual({
			items,
			total,
			current_page,
			per_page,
			last_page: Math.ceil(total / per_page),
		});
	});

	it('should return correct JSON representation with forceEntity', () => {
		const items = [new TestEntity(), new TestEntity()];
		const total = 100;
		const current_page = 1;
		const per_page = 10;

		const searchResult = new SearchResult({
			items,
			total,
			current_page,
			per_page,
		});

		const json = searchResult.toJSON(true);
		expect(json).toEqual({
			items: items.map((item) => item.toJSON()),
			total,
			current_page,
			per_page,
			last_page: Math.ceil(total / per_page),
		});
	});
});
