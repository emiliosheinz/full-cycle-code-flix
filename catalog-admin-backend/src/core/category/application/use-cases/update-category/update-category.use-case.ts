import { IUseCase } from '../../../../shared/application/use-case.interface';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { ICategoryRepository } from '../../../domain/category.repository';
import {
	CategoryOutputMapper,
	type CategoryOutput,
} from '../common/category-output';
import { UpdateCategoryInput } from './update-category.input';

type UpdateCategoryOutput = CategoryOutput;

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

		if (category.notification.hasErrors()) {
			throw new EntityValidationError(category.notification.toJSON());
		}

		await this.categoryRepository.update(category);
		return CategoryOutputMapper.toOutput(category);
	}
}
