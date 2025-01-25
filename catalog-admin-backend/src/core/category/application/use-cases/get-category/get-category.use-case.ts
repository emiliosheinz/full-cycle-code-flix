import type { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import type { ICategoryRepository } from '../../../domain/category.repository';
import {
	type CategoryOutput,
	CategoryOutputMapper,
} from '../common/category-output';

export type GetCategoryInput = {
	id: string;
};

export type GetCategoryOutput = CategoryOutput;

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

		return CategoryOutputMapper.toOutput(category);
	}
}
