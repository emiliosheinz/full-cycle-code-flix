import { Category } from '../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../infra/db/in-memory/category-in-memory.repository';
import { CategoryOutputMapper } from '../common/category-output';
import { ListCategoriesUseCase } from '../list-categories.use-case';

describe('ListCategoriesUseCase Unit Tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoriesUseCase(repository);
  });

  test('should return an empty list of categories', async () => {
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [],
      total: 0,
      current_page: 1,
      last_page: 0,
      per_page: 15,
    });
  });

  test('should return a list of categories odered by created_at', async () => {
    const items = [
      new Category({ name: 'Game', created_at: new Date(1996, 11, 17) }),
      new Category({ name: 'Movie', created_at: new Date(1995, 11, 17) }),
    ];
    repository.items = items;

    const output = await useCase.execute({});
    expect(output).toEqual({
      items: items.map((category) => CategoryOutputMapper.toOutput(category)),
      total: 2,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  test('should return a filtered list of categories', async () => {
    const items = [
      new Category({ name: 'Game', created_at: new Date(1996, 11, 17) }),
      new Category({ name: 'Movie', created_at: new Date(1995, 11, 17) }),
    ];
    repository.items = items;

    const output = await useCase.execute({ filter: 'game' });

    expect(output).toEqual({
      items: [CategoryOutputMapper.toOutput(items[0])],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 15,
    });
  });

  test('should return the second page of categories', async () => {
    const items = Array.from(
      { length: 20 },
      (_, index) =>
        new Category({
          name: `Category ${index + 1}`,
          created_at: new Date(1996, 11, 17),
        }),
    );
    repository.items = items;

    const output = await useCase.execute({ page: 2 });

    expect(output).toEqual({
      items: items
        .slice(15, 20)
        .map((category) => CategoryOutputMapper.toOutput(category)),
      total: 20,
      current_page: 2,
      last_page: 2,
      per_page: 15,
    });
  });
});
