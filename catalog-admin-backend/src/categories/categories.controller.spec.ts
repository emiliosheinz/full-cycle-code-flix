import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';

describe('CategoriesController', () => {
	let controller: CategoriesController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [
				SequelizeModule.forRoot({
					dialect: 'sqlite',
					host: ':memory:',
					logging: false,
					models: [CategoryModel],
				}),
				SequelizeModule.forFeature([CategoryModel]),
			],
			controllers: [CategoriesController],
			providers: [
				{
					provide: CategorySequelizeRepository,
					useFactory: (categoryModel: typeof CategoryModel) =>
						new CategorySequelizeRepository(categoryModel),
					inject: [getModelToken(CategoryModel)],
				},
			],
		}).compile();

		controller = module.get<CategoriesController>(CategoriesController);
	});

	it('should be defined', () => {
    console.log(controller);
		expect(controller).toBeDefined();
	});
});
