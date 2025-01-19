import type { IUseCase } from '../../shared/application/use-case.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import type { ICategoryRepository } from '../domain/category.repository';

export type GetCategoryInput = {
	id: string;
};

export type GetCategoryOutput = {
	id: string;
	name: string;
	description: string | null;
	is_active: boolean;
	created_at: Date;
};

export class GetCategoryUseCase
	implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
	constructor(private readonly categoryRepository: ICategoryRepository) {}

	async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
		const uuid = new Uuid(input.id);
		const category = await this.categoryRepository.findById(uuid);

		if (!category) {
			throw new NotFoundError(uuid, this.categoryRepository.getEntity());
		}

		return {
			id: category.category_id.id,
			name: category.name,
			description: category.description,
			is_active: category.is_active,
			created_at: category.created_at,
		};
	}
}
