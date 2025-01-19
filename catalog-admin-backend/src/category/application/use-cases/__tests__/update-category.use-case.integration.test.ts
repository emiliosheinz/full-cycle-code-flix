import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/sequelize-helpers";
import { Category } from "../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "../update-category.use-case";

describe('UpdateCategoryUseCase', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  });

  test('should throw an error if category does not exist', async () => {
    const input = { id: new Uuid().id };
    await expect(useCase.execute(input)).rejects.toThrow();
  });

  test('should update category name', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    const input = { id: entity.category_id.id, name: 'New Movie' }
    const output =  await useCase.execute(input);
    const databaseState = await repository.findById(entity.category_id);

    expect(output.name).toEqual(input.name);
    expect(output.description).toEqual(entity.description);
    expect(output.is_active).toEqual(entity.is_active);
    expect(output.created_at).toEqual(entity.created_at);
    expect(databaseState?.name).toEqual(input.name);
    expect(databaseState?.description).toEqual(entity.description);
    expect(databaseState?.is_active).toEqual(entity.is_active);
    expect(databaseState?.created_at).toEqual(entity.created_at);
  })

  test('should update category description', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    const input = { id: entity.category_id.id, description: 'New description' }
    const output =  await useCase.execute(input);
    const databaseState = await repository.findById(entity.category_id);

    expect(output.name).toEqual(entity.name);
    expect(output.description).toEqual(input.description);
    expect(output.is_active).toEqual(entity.is_active);
    expect(output.created_at).toEqual(entity.created_at);
    expect(databaseState?.name).toEqual(entity.name);
    expect(databaseState?.description).toEqual(input.description);
    expect(databaseState?.is_active).toEqual(entity.is_active);
    expect(databaseState?.created_at).toEqual(entity.created_at);
  })

  test('should activate category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    const input = { id: entity.category_id.id, is_active: true }
    const output =  await useCase.execute(input);
    const databaseState = await repository.findById(entity.category_id);

    expect(output.name).toEqual(entity.name);
    expect(output.description).toEqual(entity.description);
    expect(output.is_active).toEqual(true);
    expect(output.created_at).toEqual(entity.created_at);
    expect(databaseState?.name).toEqual(entity.name);
    expect(databaseState?.description).toEqual(entity.description);
    expect(databaseState?.is_active).toEqual(true);
    expect(databaseState?.created_at).toEqual(entity.created_at);
  })

  test('should deactivate category', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    const input = { id: entity.category_id.id, is_active : false }
    const output =  await useCase.execute(input);
    const databaseState = await repository.findById(entity.category_id);
    
    expect(output.name).toEqual(entity.name);
    expect(output.description).toEqual(entity.description);
    expect(output.is_active).toEqual(false);
    expect(output.created_at).toEqual(entity.created_at);
    expect(databaseState?.name).toEqual(entity.name);
    expect(databaseState?.description).toEqual(entity.description);
    expect(databaseState?.is_active).toEqual(false);
    expect(databaseState?.created_at).toEqual(entity.created_at);
  })
})
