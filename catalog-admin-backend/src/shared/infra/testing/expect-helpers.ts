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

function isMatch(expected: FieldsErrors, received: FieldsErrors) {
	try {
		expect(received).toEqual(expect.objectContaining(expected));
		return true;
	} catch {
		return false;
	}
}

function assertContainsMessages(
	expected: FieldsErrors,
	received: FieldsErrors,
) {
	if (isMatch(expected, received)) {
		return isValid();
	}

	return {
		pass: false,
		message: () =>
			`The validation errors do not contain ${JSON.stringify(received)}. Current:  ${JSON.stringify(expected)}`,
	};
}

expect.extend({
	containsErrorMessages(
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
			const validated = validator.validate(data as object);

			if (validated) {
				return isValid();
			}

			return assertContainsMessages(validator.errors as FieldsErrors, received);
		}
	},
});
