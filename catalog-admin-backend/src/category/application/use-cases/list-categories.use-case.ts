import {
	type PaginationOutput,
	PaginationOutputMapper,
} from '../../../shared/application/pagination-output';
import type { IUseCase } from '../../../shared/application/use-case.interface';
import type { SortDirection } from '../../../shared/domain/repository/search-input';
import {
	type CategoryFilter,
	CategorySearchInput,
	type ICategoryRepository,
} from '../../domain/category.repository';
import {
	type CategoryOutput,
	CategoryOutputMapper,
} from './common/category-output';

export type ListCategoriesInput = {
	page?: number;
	per_page?: number;
	sort?: string | null;
	sort_dir?: SortDirection | null;
	filter?: CategoryFilter | null;
};

export type ListCategoriesOutput = PaginationOutput<CategoryOutput>;

export class ListCategoriesUseCase
	implements IUseCase<ListCategoriesInput, ListCategoriesOutput>
{
	constructor(private readonly categoryRepository: ICategoryRepository) {}

	async execute(input: ListCategoriesInput): Promise<ListCategoriesOutput> {
		const params = new CategorySearchInput(input);
		const searchResult = await this.categoryRepository.search(params);
		const outputItems = searchResult.items.map((item) =>
			CategoryOutputMapper.toOutput(item),
		);
		return PaginationOutputMapper.toOutput(outputItems, searchResult);
	}
}
