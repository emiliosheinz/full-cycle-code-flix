import { Category } from '../../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe("CategoryInMemoryRepository", () => {
	let repository: CategoryInMemoryRepository;

	beforeEach(() => {
		repository = new CategoryInMemoryRepository();
	});

	test('should not filter items when filter object is null', async () => {
		const items = [
			Category.fake().aCategory().withName('Horror').build(),
			Category.fake().aCategory().withName('Action').build(),
			Category.fake().aCategory().withName('Comedy').build(),
		];

		// biome-ignore lint/complexity/useLiteralKeys: access protected method
		const result = await repository['applyFilter'](items, null);

		expect(result).toHaveLength(3);
		expect(result).toEqual(items);
	});

	test('should filter items using the filter parameter', async () => {
		const items = [
			Category.fake().aCategory().withName('Horror').build(),
			Category.fake().aCategory().withName('Action').build(),
			Category.fake().aCategory().withName('Comedy').build(),
		];

		// biome-ignore lint/complexity/useLiteralKeys: access protected method
		const result = await repository['applyFilter'](items, 'Action');

		expect(result).toHaveLength(1);
		expect(result[0]).toEqual(items[1]);
	});

	test('should sort by created_at in descending order when sort is null', () => {
		const now = new Date();

		const items = [
			Category.fake()
				.aCategory()
				.withName('Horror')
				.withCreatedAt(new Date(now.getTime() + 300))
				.build(),
			Category.fake()
				.aCategory()
				.withName('Action')
				.withCreatedAt(new Date(now.getTime() + 500))
				.build(),
			Category.fake()
				.aCategory()
				.withName('Comedy')
				.withCreatedAt(new Date(now.getTime() + 100))
				.build(),
		];

		// biome-ignore lint/complexity/useLiteralKeys: access protected method
		const result = repository['applySort'](items, null, null);

		expect(result).toHaveLength(3);
		expect(result[0]).toEqual(items[1]);
		expect(result[1]).toEqual(items[0]);
		expect(result[2]).toEqual(items[2]);
	});
});
