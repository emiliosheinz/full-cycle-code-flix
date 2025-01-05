import type { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import type { Category } from './category.entity';
import type { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { SearchInput } from '../../shared/domain/repository/search-input';
import { SearchResult } from '../../shared/domain/repository/search-result';

export type CategoryFilter = string;

export class CategorySearchInput extends SearchInput<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository
	extends ISearchableRepository<
		Category,
		Uuid,
		CategorySearchInput,
		CategorySearchResult
	> {}
