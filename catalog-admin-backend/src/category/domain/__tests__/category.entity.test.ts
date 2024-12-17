import { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../category.entity';

describe('Category', () => {
	describe('constructor', () => {
		test('should create a category with default values', () => {
			const category = new Category({
				name: 'Movie',
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.name).toEqual('Movie');
			expect(category.description).toBeNull();
			expect(category.is_active).toEqual(true);
			expect(category.created__at).toBeInstanceOf(Date);
		});

		test('should create a category with provided values', () => {
			const created__at = new Date();
			const uuid = new Uuid();
			const category = new Category({
				category_id: uuid,
				name: 'Movie',
				description: 'Movie description',
				is_active: false,
				created__at,
			});

			expect(category.category_id).toBeInstanceOf(Uuid);
			expect(category.category_id.id).toEqual(uuid.id);
			expect(category.name).toEqual('Movie');
			expect(category.description).toEqual('Movie description');
			expect(category.is_active).toEqual(false);
			expect(category.created__at).toEqual(created__at);
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
			expect(category.created__at).toBeInstanceOf(Date);
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
			expect(category.created__at).toBeInstanceOf(Date);
		});
	});

	test('should change the category name', () => {
		const category = Category.create({
			name: 'Movie',
		});

		category.changeName('Comedy');

		expect(category.name).toEqual('Comedy');
	});

	test('should change the category description', () => {
		const category = Category.create({
			name: 'Movie',
			description: 'My initial description',
		});

		category.changeDescription('My updated description');

		expect(category.description).toEqual('My updated description');
	});

	test('should activate the category', () => {
		const category = Category.create({
			name: 'Movie',
			is_active: false,
		});

		category.activate();

		expect(category.is_active).toEqual(true);
	});

	test('should deactivate the category', () => {
		const category = Category.create({
			name: 'Movie',
		});

		category.deactivate();

		expect(category.is_active).toEqual(false);
	});
});