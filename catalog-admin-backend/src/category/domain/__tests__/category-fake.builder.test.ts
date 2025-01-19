import { Chance } from 'chance';
import { CategoryFakeBuilder } from '../category-fake.builder';
import { Category } from '../category.entity';
import type { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { EntityValidationError, ValidationError } from '../../../shared/domain/validators/validation.error';

describe('CategoryFakeBuilder', () => {
	let chance: Chance.Chance;

	beforeEach(() => {
		chance = new Chance();
	});

	it('should create a single category with default values', () => {
		const category = CategoryFakeBuilder.aCategory().build();
		expect(category).toBeInstanceOf(Category);
		expect(category.name).toBeDefined();
		expect(category.description).toBeDefined();
		expect(category.is_active).toBe(true);
	});

	it('should create multiple categories with default values', () => {
		const categories = CategoryFakeBuilder.theCategories(3).build();
		expect(categories).toHaveLength(3);
		for (const category of categories) {
			expect(category).toBeInstanceOf(Category);
			expect(category.name).toBeDefined();
			expect(category.description).toBeDefined();
			expect(category.is_active).toBe(true);
		}
	});

	it('should set custom UUID', () => {
		const uuid: Uuid = chance.guid() as unknown as Uuid;
		const category = CategoryFakeBuilder.aCategory().withUuid(uuid).build();
		expect(category.category_id).toBe(uuid);
	});

	it('should set custom name', () => {
		const name = chance.word();
		const category = CategoryFakeBuilder.aCategory().withName(name).build();
		expect(category.name).toBe(name);
	});

	it('should set custom description', () => {
		const description = chance.paragraph();
		const category = CategoryFakeBuilder.aCategory()
			.withDescription(description)
			.build();
		expect(category.description).toBe(description);
	});

	it('should activate category', () => {
		const category = CategoryFakeBuilder.aCategory().activate().build();
		expect(category.is_active).toBe(true);
	});

	it('should deactivate category', () => {
		const category = CategoryFakeBuilder.aCategory().deactivate().build();
		expect(category.is_active).toBe(false);
	});

	it('should set custom created_at date', () => {
		const createdAt = new Date();
		const category = CategoryFakeBuilder.aCategory()
			.withCreatedAt(createdAt)
			.build();
		expect(category.created_at).toBe(createdAt);
	});

	it('should set invalid name too long', () => {
		const category = CategoryFakeBuilder.aCategory().withInvalidNameTooLong().build();
		expect(category.name.length).toBeGreaterThan(255);
    expect(category.notification.hasErrors()).toEqual(true);
	});
});
