import { Sequelize } from 'sequelize-typescript';
import { CategorySequelizeRepository } from '../category-sequelize.repository';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CategorySearchInput } from '../../../../domain/category.repository';

describe('CategorySequelizeRepository', () => {
	let sequelize: Sequelize;
	let repository: CategorySequelizeRepository;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			models: [CategoryModel],
			logging: false,
		});
		await sequelize.sync({ force: true });
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
    let categories: Category[];
		beforeEach(async () => {
			categories = [
				Category.fake().aCategory().withName('Horror').build(),
				Category.fake().aCategory().withName('Action').build(),
				Category.fake().aCategory().withName('Comedy').build(),
				...Array.from({ length: 97 }, () =>
					Category.fake().aCategory().build(),
				),
			];
			await repository.bulkInsert(categories);
		});

		test('should return paginated categories when no custom input is provided', async () => {
			const input = new CategorySearchInput();
			const result = await repository.search(input);
			expect(result.items).toHaveLength(input.per_page);
      expect(result.current_page).toBe(1);
 expect(result.total).toBe(100);
		});
    
    test('should filter categories by name', async () => {
      const input = new CategorySearchInput({ filter: 'Horror' });
      const result = await repository.search(input);
      expect(result.items).toHaveLength(1);
      expect(result.items[0]).toEqual(categories[0]);
      expect(result.total).toBe(1);
    })

    test('should sort categories by name in ascending order', async () => {
      const input = new CategorySearchInput({ sort: 'name', sort_dir: 'asc' });
      const result = await repository.search(input);
      const sortedCategories = [...categories].sort((a, b) => a.name > b.name ? 1 : -1);
      const expectedItems = sortedCategories.slice(0, input.per_page)
      expect(result.items).toEqual(expectedItems);
    })

    test('should sort categories by name in descending order', async () => {
      const input = new CategorySearchInput({ sort: 'name', sort_dir: 'desc' });
      const result = await repository.search(input);
      const sortedCategories = [...categories].sort((a, b) => a.name > b.name ? -1 : 1);
      const expectedItems = sortedCategories.slice(0, input.per_page)
      expect(result.items).toEqual(expectedItems);
    })
	});
});
