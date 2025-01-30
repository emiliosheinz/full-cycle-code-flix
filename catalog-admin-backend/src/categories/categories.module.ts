import { Module } from '@nestjs/common';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { CategoriesController } from './categories.controller';
import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '@core/category/infra/db/sequelize/category-sequelize.repository';

@Module({
	imports: [SequelizeModule.forFeature([CategoryModel])],
	controllers: [CategoriesController],
	providers: [
		{
			provide: CategorySequelizeRepository,
			useFactory: (categoryModel: typeof CategoryModel) =>
				new CategorySequelizeRepository(categoryModel),
			inject: [getModelToken(CategoryModel)],
		},
	],
})
export class CategoriesModule {}
