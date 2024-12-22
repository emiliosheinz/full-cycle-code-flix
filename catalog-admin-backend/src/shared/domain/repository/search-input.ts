import { isNumber } from 'lodash';
import { ValueObject } from '../value-object';

export type SortDirection = 'asc' | 'desc';

export type SearchParamsConstructorProps<Filter = string> = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: Filter | null;
};

export class SearchInput<Filter = string> extends ValueObject {
  private _page = 0;
  private _per_page = 15;
  private _sort: string | null = null;
  private _sort_dir: SortDirection | null = null;
  private _filter: Filter | null = null;

  constructor(props: SearchParamsConstructorProps<Filter> = {}) {
    super();
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }

  public get page(): number {
    return this._page;
  }

  private set page(value: number | undefined) {
    if (
      !isNumber(value) ||
      Number.parseInt(String(value)) !== value ||
      value <= 0
    ) {
      this._page = 1;
    } else {
      this._page = value;
    }
  }

  get per_page(): number {
    return this._per_page;
  }

  private set per_page(value: number | undefined) {
    if (
      !isNumber(value) ||
      Number.parseInt(String(value)) !== value ||
      value <= 0
    ) {
      this._per_page = 15;
    } else {
      this._per_page = value;
    }
  }

  get sort(): string | null {
    return this._sort;
  }

  private set sort(value: string | null | undefined) {
    this._sort = value || null;
  }

  get sort_dir(): SortDirection | null {
    return this._sort_dir;
  }

  private set sort_dir(value: SortDirection | null | undefined) {
    if (!this.sort) {
      this._sort_dir = null;
      return;
    }

    const dir = `${value}`.toLowerCase();
    const isValidDir = dir === 'asc' || dir === 'desc';
    this._sort_dir = isValidDir ? dir : 'asc';
  }

  get filter(): Filter | null {
    return this._filter;
  }

  protected set filter(value: Filter | null | undefined) {
    this._filter = value || null;
  }
}
