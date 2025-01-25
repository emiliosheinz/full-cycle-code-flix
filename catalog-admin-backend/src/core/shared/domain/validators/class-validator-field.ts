import { validateSync } from 'class-validator';
import type { IValidatorFields } from './validator-fields-interface';
import type { Notification } from './notification';

export abstract class ClassValidatorFields implements IValidatorFields {
	validate(
		notification: Notification,
		data: unknown,
		fields: string[],
	): boolean {
		const errors = validateSync(data as object, { groups: fields });
		for (const error of errors) {
			const field = error.property;
			const messages = Object.values(error.constraints ?? {});
			for (const message of messages) {
				notification.addError(message, field);
			}
		}
		return !errors.length;
	}
}
