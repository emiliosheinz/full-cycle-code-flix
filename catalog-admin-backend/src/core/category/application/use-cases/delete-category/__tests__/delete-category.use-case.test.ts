import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../../infra/db/in-memory/category-in-memory.repository';
import { DeleteCategoryUseCase } from '../delete-category.use-case';

describe('DeleteCategoryUseCase', () => {
	let deleteCategoryUseCase: DeleteCategoryUseCase;
	let categoryRepository: CategoryInMemoryRepository;

	beforeEach(() => {
		categoryRepository = new CategoryInMemoryRepository();
		deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepository);
	});

	test('should throw an error if category does not exist', async () => {
		const input = { id: new Uuid().id };

		await expect(deleteCategoryUseCase.execute(input)).rejects.toThrow(
			NotFoundError,
		);
	});

	test('should delete category', async () => {
		const spyDelete = jest.spyOn(categoryRepository, 'delete');
		const entity = new Category({ name: 'Movie' });
		categoryRepository.items = [entity];

		const input = { id: entity.category_id.id };
		await deleteCategoryUseCase.execute(input);

		expect(spyDelete).toHaveBeenCalledTimes(1);
		expect(categoryRepository.items).toHaveLength(0);
	});
});
