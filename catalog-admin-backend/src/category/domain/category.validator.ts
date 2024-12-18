import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	MaxLength,
} from 'class-validator';
import type { Category } from './category.entity';
import { ClassValidatorFields } from '../../shared/domain/validators/class-validator-field';

class CategoryRules {
	@MaxLength(255)
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	description: string | null;

	@IsBoolean()
	@IsNotEmpty()
	is_active: boolean;

	constructor({ name, description, is_active }: Category) {
		this.name = name;
		this.description = description;
		this.is_active = is_active;
	}
}

export class CategoryValidator extends ClassValidatorFields {
	validate<Category>(entity: Category) {
		return super.validate(new CategoryRules(entity));
	}
}
