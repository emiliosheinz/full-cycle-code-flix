import { EntityValidationError } from '../../../shared/domain/validators/validation.error';
import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.entity';

describe('Category', () => {
	const validateSpy = jest.spyOn(Category, 'validate');

	describe('constructor', () => {
		test('should create a category with default values', () => {
			const category = new Category({
				name: 'Movie',
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.name).toEqual('Movie');
			expect(category.description).toBeNull();
			expect(category.is_active).toEqual(true);
			expect(category.created_at).toBeInstanceOf(Date);
		});

		test('should create a category with provided values', () => {
			const created_at = new Date();
			const uuid = new Uuid();
			const category = new Category({
				category_id: uuid,
				name: 'Movie',
				description: 'Movie description',
				is_active: false,
				created_at,
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.category_id.id).toEqual(uuid.id);
			expect(category.name).toEqual('Movie');
			expect(category.description).toEqual('Movie description');
			expect(category.is_active).toEqual(false);
			expect(category.created_at).toEqual(created_at);
		});
	});

	describe('create', () => {
		test('should create a category with default values', () => {
			const category = Category.create({
				name: 'Movie',
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.name).toEqual('Movie');
			expect(category.description).toBeNull();
			expect(category.is_active).toEqual(true);
			expect(category.created_at).toBeInstanceOf(Date);
			expect(validateSpy).toHaveReturnedTimes(1);
		});

		test('should create a category with provided values', () => {
			const category = Category.create({
				name: 'Movie',
				description: 'Movie description',
				is_active: false,
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.name).toEqual('Movie');
			expect(category.description).toEqual('Movie description');
			expect(category.is_active).toEqual(false);
			expect(category.created_at).toBeInstanceOf(Date);
			expect(validateSpy).toHaveReturnedTimes(1);
		});
	});

	test('should change the category name', () => {
		const category = Category.create({
			name: 'Movie',
		});

		category.changeName('Comedy');

		expect(category.name).toEqual('Comedy');
		expect(validateSpy).toHaveReturnedTimes(2);
	});

	test('should change the category description', () => {
		const category = Category.create({
			name: 'Movie',
			description: 'My initial description',
		});

		category.changeDescription('My updated description');

		expect(category.description).toEqual('My updated description');
		expect(validateSpy).toHaveReturnedTimes(2);
	});

	test('should activate the category', () => {
		const category = Category.create({
			name: 'Movie',
			is_active: false,
		});

		category.activate();

		expect(category.is_active).toEqual(true);
		expect(validateSpy).toHaveReturnedTimes(1);
	});

	test('should deactivate the category', () => {
		const category = Category.create({
			name: 'Movie',
		});

		category.deactivate();

		expect(category.is_active).toEqual(false);
		expect(validateSpy).toHaveReturnedTimes(1);
	});

	describe('validate', () => {
		describe('create', () => {
			test.each([null, undefined])(
				'should throw error when create is called with invalid name "%s"',
				(name) => {
					expect(() => {
						Category.create({
							// biome-ignore lint: Send invalid value to create function
							name: name!,
						});
					}).containsErrorMessages({
						name: [
							'name should not be empty',
							'name must be a string',
							'name must be shorter than or equal to 255 characters',
						],
					});
				},
			);

			test("shold throw error when create is called with invalid name ''", () => {
				expect(() => {
					Category.create({
						name: '',
					});
				}).containsErrorMessages({
					name: ['name should not be empty'],
				});
			});

			test('should throw error when create is called with name longer than 255 characters', () => {
				expect(() => {
					Category.create({
						name: 'a'.repeat(256),
					});
				}).containsErrorMessages({
					name: ['name must be shorter than or equal to 255 characters'],
				});
			});

			test('should throw error when create is called with invalid description', () => {
				expect(() => {
					Category.create({
						name: 'Movie',
						// biome-ignore lint: Send invalid value to create function
						description: 123 as any,
					});
				}).containsErrorMessages({
					description: ['description must be a string'],
				});
			});

			test('should throw error when create is called with invalid is_active', () => {
				expect(() => {
					Category.create({
						name: 'Movie',
						// biome-ignore lint: Send invalid value to create function
						is_active: 123 as any,
					});
				}).containsErrorMessages({
					is_active: ['is_active must be a boolean value'],
				});
			});
		});
	});
});
