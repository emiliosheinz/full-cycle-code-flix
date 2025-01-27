import {
	ValidationError,
	EntityValidationError,
	SearchValidationError,
	LoadEntityError,
} from '../validation.error';
import { FieldsErrors } from '../validator-fields-interface';

describe('Validation Errors', () => {
	const mockErrors: FieldsErrors[] = [{ name: ['Name is required'] }];

	describe('ValidationError', () => {
		it('should create an instance of ValidationError', () => {
			const error = new ValidationError();
			expect(error).toBeInstanceOf(ValidationError);
		});
	});

	describe('EntityValidationError', () => {
		it('should create an instance with default message', () => {
			const error = new EntityValidationError(mockErrors);
			expect(error.message).toBe('Validation Error');
			expect(error.error).toBe(mockErrors);
		});

		it('should create an instance with custom message', () => {
			const error = new EntityValidationError(
				mockErrors,
				'Custom Error Message',
			);
			expect(error.message).toBe('Custom Error Message');
			expect(error.error).toBe(mockErrors);
		});
	});

	describe('SearchValidationError', () => {
		it('should create an instance with default message', () => {
			const error = new SearchValidationError(mockErrors);
			expect(error.message).toBe('Search Validation Error');
			expect(error.error).toBe(mockErrors);
			expect(error.name).toBe('SearchValidationError');
		});
	});

	describe('LoadEntityError', () => {
		it('should create an instance with default message', () => {
			const error = new LoadEntityError(mockErrors);
			expect(error.message).toBe('LoadEntityError');
			expect(error.error).toBe(mockErrors);
			expect(error.name).toBe('LoadEntityError');
		});
	});
});
