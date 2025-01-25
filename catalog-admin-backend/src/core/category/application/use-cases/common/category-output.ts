import type { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
	id: string;
	name: string;
	description: string | null;
	is_active: boolean;
	created_at: Date;
};

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CategoryOutputMapper {
	static toOutput(category: Category): CategoryOutput {
		return {
			id: category.category_id.id,
			name: category.name,
			description: category.description,
			is_active: category.is_active,
			created_at: category.created_at,
		};
	}
}
