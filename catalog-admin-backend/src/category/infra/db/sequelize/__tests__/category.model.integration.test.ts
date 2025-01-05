import { DataType, Sequelize } from 'sequelize-typescript';
import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';

describe('CategoryModel', () => {
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

	test('should have the right attributes', async () => {
		const attributes = CategoryModel.getAttributes();
		const attributeKeys = Object.keys(attributes);

		expect(attributeKeys).toEqual([
			'category_id',
			'name',
			'description',
			'is_active',
			'created_at',
		]);
		expect(attributes.category_id).toMatchObject({
			field: 'category_id',
			fieldName: 'category_id',
			primaryKey: true,
			type: DataType.UUID(),
		});
    expect(attributes.name).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
    expect(attributes.description).toMatchObject({
      field: 'description',
      fieldName: 'description',
      allowNull: true,
      type: DataType.TEXT(),
    });
    expect(attributes.is_active).toMatchObject({
      field: 'is_active',
      fieldName: 'is_active',
      allowNull: false,
      type: DataType.BOOLEAN(),
    });
    expect(attributes.created_at).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
	});

	test('should create a category', async () => {
		const input = Category.fake().aCategory().build();

		const output = await CategoryModel.create({
			category_id: input.category_id.id,
			name: input.name,
			description: input.description,
			is_active: input.is_active,
			created_at: input.created_at,
		});

    expect(output.category_id).toBe(input.category_id.id);
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(input.description);
    expect(output.is_active).toBe(input.is_active);
    expect(output.created_at).toBe(input.created_at);
	});
});
