import { setupSequelize } from "../../../../shared/infra/testing/sequelize-helpers";
import { Category } from "../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { ListCategoriesUseCase } from "../list-categories.use-case";

describe('ListCategoriesUseCase Integration Tests', () => {
  let useCase: ListCategoriesUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
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
  })

  test('should return a list of categories odered by created_at', async () => {
    const items = [
      new Category({ name: 'Game', created_at: new Date(1996, 11, 17) }),
      new Category({ name: 'Movie', created_at: new Date(1995, 11, 17) }),
    ];
    repository.bulkInsert(items);

    const output = await useCase.execute({});
    expect(output.items.length).toEqual(2);
    expect(output.items[0].name).toEqual('Game');
    expect(output.items[1].name).toEqual('Movie');
  })

  test('should return a filtered list of categories', async () => {
    const items = [
      new Category({ name: 'Game', created_at: new Date(1996, 11, 17) }),
      new Category({ name: 'Movie', created_at: new Date(1995, 11, 17) }),
    ];
    repository.bulkInsert(items);

    const output = await useCase.execute({ filter: 'game' });
    expect(output.items.length).toEqual(1);
    expect(output.items[0].name).toEqual('Game');
  })

  test('should return a paginated list of categories', async () => {
    const items = [
      new Category({ name: 'Game', created_at: new Date(1996, 11, 17) }),
      new Category({ name: 'Movie', created_at: new Date(1995, 11, 17) }),
      new Category({ name: 'Music', created_at: new Date(1994, 11, 17) }),
      new Category({ name: 'Book', created_at: new Date(1993, 11, 17) }),
      new Category({ name: 'Food', created_at: new Date(1992, 11, 17) }),
    ];
    repository.bulkInsert(items);

    const output = await useCase.execute({ page: 1, per_page: 2 });
    expect(output.items.length).toEqual(2);
    expect(output.items[0].name).toEqual('Game');
    expect(output.items[1].name).toEqual('Movie');
    expect(output.total).toEqual(5);
    expect(output.current_page).toEqual(1);
    expect(output.last_page).toEqual(3);
    expect(output.per_page).toEqual(2);
  })
})
