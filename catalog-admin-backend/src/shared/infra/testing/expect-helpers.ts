import type { FieldsErrors } from '../../domain/validators/validator-fields-interface';
import type { ClassValidatorFields } from '../../domain/validators/class-validator-field';
import type { EntityValidationError } from '../../domain/validators/validation.error';

type ContainsErrorMessageExpected =
	| {
			validator: ClassValidatorFields;
			data: unknown;
	  }
	| (() => unknown);

function isValid() {
	return { pass: true, message: () => '' };
}

function assertContainsMessages(
	expected: FieldsErrors,
	received: FieldsErrors,
) {
	const isMatch = expect.objectContaining(received).asymetricMatch(expected);

	if (isMatch) {
		return isValid();
	}

	return {
		pass: false,
		message: () =>
			`The validation errors do not contain ${JSON.stringify(received)}. Current:  ${JSON.stringify(expected)}`,
	};
}

expect.extend({
	containsErrorMessage(
		expected: ContainsErrorMessageExpected,
		received: FieldsErrors,
	) {
		if (typeof expected === 'function') {
			try {
				expected();
				return isValid();
			} catch (e) {
				const error = e as EntityValidationError;
				return assertContainsMessages(error.error, received);
			}
		} else {
			const { validator, data } = expected;
			const validated = validator.validate(data);

			if (validated) {
				return isValid();
			}

			return assertContainsMessages(validator.errors as FieldsErrors, received);
		}
	},
});
