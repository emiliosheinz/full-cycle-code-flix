import { Category } from '../../../domain/category.entity';
import { CategoryOutputMapper } from './category-output';

describe('CategoryOutputMapper', () => {
	test('should return a category output', () => {
		const category = new Category({
			name: 'Movie',
			description: 'A movie category',
		});

		const output = CategoryOutputMapper.toOutput(category);

		expect(output).toStrictEqual({
			id: category.category_id.id,
			name: category.name,
			description: category.description,
			is_active: category.is_active,
			created_at: category.created_at,
		});
	});
});
