import { validateSync } from 'class-validator';
import type {
	FieldsErrors,
	IValidatorFields,
} from './validator-fields-interface';

export abstract class ClassValidatorFields implements IValidatorFields {
	errors: FieldsErrors | null = null;

	validate<T extends object>(data: T): boolean {
		this.errors = {};
		const errors = validateSync(data);
		for (const error of errors) {
			const field = error.property;
			this.errors[field] = error.constraints
				? Object.values(error.constraints)
				: [];
		}
		return !errors.length;
	}
}
