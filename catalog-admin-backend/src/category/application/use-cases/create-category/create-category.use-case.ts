import type { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Category } from '../../../domain/category.entity';
import type { ICategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutputMapper,
  type CategoryOutput,
} from '../common/category-output';

type CreateCategoryInput = {
  name: string;
  description?: string;
  is_active?: boolean;
};

type CreateCategoryOutput = CategoryOutput;

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) { }

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const entity = Category.create(input);
    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }
    await this.categoryRepository.insert(entity);
    return CategoryOutputMapper.toOutput(entity);
  }
}
