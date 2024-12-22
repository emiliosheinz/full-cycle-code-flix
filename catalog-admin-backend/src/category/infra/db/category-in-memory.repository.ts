import type {
  SearchInput,
  SortDirection,
} from '../../../shared/domain/repository/search-input';
import type { Uuid } from '../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../shared/infra/db/in-memory.repository';
import { Category } from '../../domain/category.entity';

export class CategoryInMemoryRepository extends InMemorySearchableRepository<
  Category,
  Uuid,
  SearchInput<string>
> {
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: Category[],
    filter: string | null,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null,
  ): Category[] {
    if (!sort) {
      return super.applySort(items, 'created_at', 'desc');
    }

		return super.applySort(items, sort, sort_dir);
	}

	getEntity() {
		return Category;
	}
}
