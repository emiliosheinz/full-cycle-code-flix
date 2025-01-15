import type { IUseCase } from '../../shared/application/use-case.interface';
import { NotFoundError } from '../../shared/domain/errors/not-found.error';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { Category } from '../domain/category.entity';
import type { ICategoryRepository } from '../domain/category.repository';

type UpdateCategoryInput = {
	id: string;
	name?: string;
	description?: string;
	is_active?: boolean;
};

type UpdateCategoryOutput = {
	id: string;
	name: string;
	created_at: Date;
	is_active: boolean;
	description: string | null;
};

export class UpdateCategoryUseCase
	implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
	constructor(private readonly categoryRepository: ICategoryRepository) {}

	async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
		const uuid = new Uuid(input.id);
		const category = await this.categoryRepository.findById(uuid);

		if (!category) {
			throw new NotFoundError(uuid, this.categoryRepository.getEntity());
		}

		if (input.name) {
			category.changeName(input.name);
		}

		if ('description' in input) {
			category.changeDescription(input.description);
		}

		if (input.is_active === true) {
			category.activate();
		}

		if (input.is_active === false) {
			category.deactivate();
		}

		await this.categoryRepository.update(category);

		return {
			id: category.category_id.id,
			name: category.name,
			description: category.description,
			is_active: category.is_active,
			created_at: category.created_at,
		};
	}
}
