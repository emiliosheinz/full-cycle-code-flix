import type { IUseCase } from '../../shared/application/use-case.interface';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import type { ICategoryRepository } from '../domain/category.repository';

export type DeleteCategoryInput = {
	id: string;
};

// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
export type DeleteCategoryOutput = void;

export class DeleteCategoryUseCase
	implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
	constructor(private readonly categoryRepository: ICategoryRepository) {}

	async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
		const uuid = new Uuid(input.id);
		await this.categoryRepository.delete(uuid);
	}
}
