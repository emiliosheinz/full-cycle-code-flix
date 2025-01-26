import { SearchInput } from '../search-input';
import { SearchParamsConstructorProps, SortDirection } from '../search-input';

describe('SearchInput', () => {
	test('should set default values when no props are provided', () => {
		const searchInput = new SearchInput({});
		expect(searchInput.page).toBe(1);
		expect(searchInput.per_page).toBe(15);
		expect(searchInput.sort).toBeNull();
		expect(searchInput.sort_dir).toBeNull();
		expect(searchInput.filter).toBeNull();
	});

	test('should set provided values correctly', () => {
		const props: SearchParamsConstructorProps = {
			page: 2,
			per_page: 20,
			sort: 'name',
			sort_dir: 'desc',
			filter: 'test',
		};
		const searchInput = new SearchInput(props);
		expect(searchInput.page).toBe(2);
		expect(searchInput.per_page).toBe(20);
		expect(searchInput.sort).toBe('name');
		expect(searchInput.sort_dir).toBe('desc');
		expect(searchInput.filter).toBe('test');
	});

	test('should set default page when invalid page is provided', () => {
		const searchInput = new SearchInput({ page: -1 });
		expect(searchInput.page).toBe(1);
	});

	test('should set default per_page when invalid per_page is provided', () => {
		const searchInput = new SearchInput({ per_page: -1 });
		expect(searchInput.per_page).toBe(15);
	});

	test('should set sort_dir to null when sort is not provided', () => {
		const searchInput = new SearchInput({ sort_dir: 'desc' });
		expect(searchInput.sort_dir).toBeNull();
	});

	test('should set sort_dir to asc when invalid sort_dir is provided', () => {
		const searchInput = new SearchInput({
			sort: 'name',
			sort_dir: 'invalid' as SortDirection,
		});
		expect(searchInput.sort_dir).toBe('asc');
	});

	test('should set filter to null when filter is not provided', () => {
		const searchInput = new SearchInput({});
		expect(searchInput.filter).toBeNull();
	});
});
