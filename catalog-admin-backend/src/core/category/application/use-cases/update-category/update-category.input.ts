import {
	IsBoolean,
	IsNotEmpty,
	IsOptional,
	IsString,
	validateSync,
} from 'class-validator';

export type UpdateCategoryInputConstructorProps = {
	id: string;
	name?: string;
	description?: string | null;
	is_active?: boolean;
};

export class UpdateCategoryInput {
	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsOptional()
	name?: string;

	@IsString()
	@IsOptional()
	description?: string | null;

	@IsBoolean()
	@IsOptional()
	is_active?: boolean;

	constructor(props: UpdateCategoryInputConstructorProps) {
		this.id = props.id;
		if (props.name) {
			this.name = props.name;
		}

		if (props.description !== undefined) {
			this.description = props.description;
		}

		if (props.is_active !== undefined) {
			this.is_active = props.is_active;
		}
	}
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class ValidateUpdateCategoryInput {
	static validte(input: UpdateCategoryInput) {
		return validateSync(input);
	}
}
