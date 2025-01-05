import { Sequelize } from 'sequelize-typescript';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { CategoryModelMapper } from '../category-model-mapper';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';

describe('CategoryModelMapper', () => {
	let sequelize: Sequelize;

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			models: [CategoryModel],
			logging: false,
		});
		await sequelize.sync({ force: true });
	});

	test('should throw an error when category is invalid', () => {
		// @ts-expect-error: intentionally passing an invalid object
		const model = CategoryModel.build({
			category_id: 'c8d798f0-ba72-49c6-82f9-39af37797a6b',
		});
		expect(() => CategoryModelMapper.toEntity(model)).toThrow(
			EntityValidationError,
		);
	});

  test('should map a model to an entity', () => {
    const model = CategoryModel.build({
      category_id: 'c8d798f0-ba72-49c6-82f9-39af37797a6b',
      name: 'Horror',
      description: 'Scary movies',
      is_active: true,
      created_at: new Date(),
    });

    const entity = CategoryModelMapper.toEntity(model);

    expect(entity).toBeInstanceOf(Category);
    expect(entity.category_id.id).toBe(model.category_id);
    expect(entity.name).toBe(model.name);
    expect(entity.description).toBe(model.description);
    expect(entity.is_active).toBe(model.is_active);
    expect(entity.created_at).toBe(model.created_at);
  })

  test('should map an entity to a model', () => {
    const entity = new Category({
      category_id: new Uuid(),
      name: 'Horror',
      description: 'Scary movies',
      is_active: true,
      created_at: new Date(),
    });

    const model = CategoryModelMapper.toModel(entity);

    expect(model).toBeInstanceOf(CategoryModel);
    expect(model.category_id).toBe(entity.category_id.id);
    expect(model.name).toBe(entity.name);
    expect(model.description).toBe(entity.description);
    expect(model.is_active).toBe(entity.is_active);
    expect(model.created_at).toBe(entity.created_at);
  })
});
