import type { IUseCase } from '../../shared/application/use-case.interface';
import { Category } from '../domain/category.entity';
import type { ICategoryRepository } from '../domain/category.repository';

type CreateCategoryInput = {
	name: string;
	description?: string;
	is_active?: boolean;
};

type CreateCategoryOutput = {
	id: string;
	name: string;
	created_at: Date;
  is_active: boolean;
  description: string | null;
};

export class CreateCategoryUseCase
	implements IUseCase<CreateCategoryInput, CreateCategoryOutput>
{
	constructor(private readonly categoryRepository: ICategoryRepository) {}

	async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
		const entity = Category.create(input);
		await this.categoryRepository.insert(entity);
		return {
			id: entity.category_id.id,
			name: entity.name,
			description: entity.description,
			is_active: entity.is_active,
			created_at: entity.created_at,
		};
	}
}
