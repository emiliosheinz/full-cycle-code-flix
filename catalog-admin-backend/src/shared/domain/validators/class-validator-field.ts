import { validateSync } from 'class-validator';
import { FieldsErrors, IValidatorFields } from './validator-fields-interface';

export abstract class ClassValidatorFields implements IValidatorFields {
	errors: FieldsErrors | null = null;

	validate(data: any): boolean {
		this.errors = {};
		const errors = validateSync(data);
		for (const error of errors) {
			const field = error.property;
			this.errors[field] = Object.values(error.constraints!);
		}
		return !errors.length;
	}
}
