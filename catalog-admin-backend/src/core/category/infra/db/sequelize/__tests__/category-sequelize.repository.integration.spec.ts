import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import {
	CategorySearchInput,
	CategorySearchResult,
} from '../../../../domain/category.repository';
import { setupSequelize } from '../../../../../shared/infra/testing/sequelize-helpers';

describe('CategorySequelizeRepository', () => {
	let repository: CategorySequelizeRepository;
	setupSequelize({ models: [CategoryModel] });

	beforeEach(async () => {
		repository = new CategorySequelizeRepository(CategoryModel);
	});

	test('should insert a new category', async () => {
		const category = Category.fake().aCategory().build();
		await repository.insert(category);
		const model = await CategoryModel.findByPk(category.category_id.id);
		expect(model?.toJSON()).toMatchObject({
			category_id: category.category_id.id,
			name: category.name,
			description: category.description,
			is_active: category.is_active,
			created_at: category.created_at,
		});
	});

	test('should bulk insert categories', async () => {
		const categories = [
			Category.fake().aCategory().build(),
			Category.fake().aCategory().build(),
			Category.fake().aCategory().build(),
		];
		await repository.bulkInsert(categories);
		const models = await CategoryModel.findAll();
		expect(models).toHaveLength(3);
	});

	test('should update a category', async () => {
		const category = Category.fake().aCategory().build();
		await repository.insert(category);

		const updatedCategory = Category.fake().aCategory().build();
		updatedCategory.category_id = category.category_id;
		await repository.update(updatedCategory);

		const model = await CategoryModel.findByPk(category.category_id.id);
		expect(model?.toJSON()).toMatchObject({
			category_id: updatedCategory.category_id.id,
			name: updatedCategory.name,
			description: updatedCategory.description,
			is_active: updatedCategory.is_active,
			created_at: updatedCategory.created_at,
		});
	});

	test('should throw an error when updating a non-existing category', async () => {
		const category = Category.fake().aCategory().build();
		await expect(repository.update(category)).rejects.toThrow(NotFoundError);
	});

	test('should delete a category', async () => {
		const category = Category.fake().aCategory().build();
		await repository.insert(category);
		await repository.delete(category.category_id);
		const model = await CategoryModel.findByPk(category.category_id.id);
		expect(model).toBeNull();
	});

	test('should throw an error when deleting a non-existing category', async () => {
		const category = Category.fake().aCategory().build();
		await expect(repository.delete(category.category_id)).rejects.toThrow(
			NotFoundError,
		);
	});

	test('should find a category by id', async () => {
		const category = Category.fake().aCategory().build();
		await repository.insert(category);
		const result = await repository.findById(category.category_id);
		expect(result).toEqual(category);
	});

	test('should return null when finding a non-existing category by id', async () => {
		const result = await repository.findById(
			Category.fake().aCategory().build().category_id,
		);
		expect(result).toBeNull();
	});

	test('should find all categories', async () => {
		const categories = [
			Category.fake().aCategory().build(),
			Category.fake().aCategory().build(),
			Category.fake().aCategory().build(),
		];
		await repository.bulkInsert(categories);
		const result = await repository.findAll();
		expect(result).toEqual(categories);
	});

	test('should return empty array when there are no categories', async () => {
		const result = await repository.findAll();
		expect(result).toEqual([]);
	});

	describe('search', () => {
		test('should return paginated categories when no custom input is provided', async () => {
			const created_at = new Date();
			const categories = Category.fake()
				.theCategories(100)
				.withName('Movie')
				.withDescription(null)
				.withCreatedAt(created_at)
				.build();
			await repository.bulkInsert(categories);
			const input = new CategorySearchInput();
			const result = await repository.search(input);
			expect(result).toBeInstanceOf(CategorySearchResult);
			expect(result.toJSON()).toMatchObject({
				total: 100,
				current_page: 1,
				last_page: 7,
				per_page: 15,
				items: categories.slice(0, 15),
			});
		});

		test('should order by created_at in descending order when sort is null', async () => {
			const created_at = new Date();
			const categories = Category.fake()
				.theCategories(100)
				.withName((index) => `Movie ${index}`)
				.withDescription(null)
				.withCreatedAt((index) => new Date(created_at.getTime() + index))
				.build();
			await repository.bulkInsert(categories);
			const input = new CategorySearchInput();
			const result = await repository.search(input);
			expect(result).toBeInstanceOf(CategorySearchResult);
			expect(result.toJSON()).toMatchObject({
				total: 100,
				current_page: 1,
				last_page: 7,
				per_page: 15,
				items: [...categories].reverse().slice(0, 15),
			});
		});

		it('should apply pagination and filtering', async () => {
			const now = new Date().getTime();
			const categories = [
				Category.fake()
					.aCategory()
					.withName('test')
					.withCreatedAt(new Date(now + 4000))
					.build(),
				Category.fake()
					.aCategory()
					.withName('random')
					.withCreatedAt(new Date(now + 3000))
					.build(),
				Category.fake()
					.aCategory()
					.withName('TEST')
					.withCreatedAt(new Date(now + 2000))
					.build(),
				Category.fake()
					.aCategory()
					.withName('TeST')
					.withCreatedAt(new Date(now + 1000))
					.build(),
			];
			await repository.bulkInsert(categories);
			const input = new CategorySearchInput({
				filter: 'TEST',
				page: 1,
				per_page: 2,
			});
			const result = await repository.search(input);
			expect(result).toBeInstanceOf(CategorySearchResult);
			expect(result.toJSON()).toMatchObject({
				total: 3,
				current_page: 1,
				last_page: 2,
				per_page: 2,
				items: [categories[0], categories[2]],
			});
		});

		test('should apply pagination and sorting', async () => {
			const categories = [
				Category.fake().aCategory().withName('b').build(),
				Category.fake().aCategory().withName('a').build(),
				Category.fake().aCategory().withName('d').build(),
				Category.fake().aCategory().withName('e').build(),
				Category.fake().aCategory().withName('c').build(),
			];
			await repository.bulkInsert(categories);
			const input = new CategorySearchInput({
				sort: 'name',
				sort_dir: 'asc',
				page: 1,
				per_page: 3,
			});
			const result = await repository.search(input);
			expect(result).toBeInstanceOf(CategorySearchResult);
			expect(result.toJSON()).toMatchObject({
				total: 5,
				current_page: 1,
				last_page: 2,
				per_page: 3,
				items: [categories[1], categories[0], categories[4]],
			});
		});
	});
});
