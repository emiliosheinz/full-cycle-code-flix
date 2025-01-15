import { NotFoundError } from '../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../infra/db/in-memory/category-in-memory.repository';
import { UpdateCategoryUseCase } from '../update-category.use-case';

describe('UpdateCategoryUseCase', () => {
	let updateCategoryUseCase: UpdateCategoryUseCase;
	let categoryRepository: CategoryInMemoryRepository;

	beforeEach(() => {
		categoryRepository = new CategoryInMemoryRepository();
		updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);
	});

	test('should throw an error if category does not exist', async () => {
		const input = { id: new Uuid().id };

		await expect(updateCategoryUseCase.execute(input)).rejects.toThrow(
			NotFoundError,
		);
	});

  test('should update category name', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = new Category({ name: 'Movie' });
    categoryRepository.items = [entity];

    const input = { id: entity.category_id.id, name: 'New Movie' }
    const output =  await updateCategoryUseCase.execute(input);

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output.name).toBe(input.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(entity.is_active);
    expect(output.created_at).toBe(entity.created_at);
  });

  test('should update category description', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = new Category({ name: 'Movie' });
    categoryRepository.items = [entity];

    const input = { id: entity.category_id.id, description: 'New description' }
    const output =  await updateCategoryUseCase.execute(input);

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(input.description);
    expect(output.is_active).toBe(entity.is_active);
    expect(output.created_at).toBe(entity.created_at);
  })

  test('should activate category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = new Category({ name: 'Movie' });
    categoryRepository.items = [entity];

    const input = { id: entity.category_id.id, is_active: true }
    const output =  await updateCategoryUseCase.execute(input);

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(true);
    expect(output.created_at).toBe(entity.created_at);
  });

  test('should deactivate category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = new Category({ name: 'Movie' });
    categoryRepository.items = [entity];

    const input = { id: entity.category_id.id, is_active: false }
    const output =  await updateCategoryUseCase.execute(input);

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output.name).toBe(entity.name);
    expect(output.description).toBe(entity.description);
    expect(output.is_active).toBe(false);
    expect(output.created_at).toBe(entity.created_at);
  });
});
