import { Op } from 'sequelize';
import { NotFoundError } from '../../../../shared/domain/errors/not-found.error';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { Category } from '../../../domain/category.entity';
import { CategorySearchResult } from '../../../domain/category.repository';
import type {
	CategorySearchInput,
	ICategoryRepository,
} from '../../../domain/category.repository';
import type { CategoryModel } from './category.model';

export class CategorySequelizeRepository implements ICategoryRepository {
	sortableFields: string[] = ['name', 'created_at'];

	constructor(private readonly model: typeof CategoryModel) {}

	async insert(entity: Category): Promise<void> {
		await this.model.create({
			category_id: entity.category_id.id,
			name: entity.name,
			description: entity.description,
			is_active: entity.is_active,
			created_at: entity.created_at,
		});
	}

	async bulkInsert(entities: Category[]): Promise<void> {
		await this.model.bulkCreate(
			entities.map((entity) => ({
				category_id: entity.category_id.id,
				name: entity.name,
				description: entity.description,
				is_active: entity.is_active,
				created_at: entity.created_at,
			})),
		);
	}

	async update(entity: Category): Promise<void> {
		const model = await this.model.findByPk(entity.category_id.id);

		if (!model) {
			throw new NotFoundError(entity.category_id, this.getEntity());
		}

		await this.model.update(
			{
				name: entity.name,
				description: entity.description,
				is_active: entity.is_active,
				created_at: entity.created_at,
			},
			{
				where: {
					category_id: entity.category_id.id,
				},
			},
		);
	}

	async delete(entity_id: Uuid): Promise<void> {
		const model = await this.model.findByPk(entity_id.id);

		if (!model) {
			throw new NotFoundError(entity_id, this.getEntity());
		}

		await this.model.destroy({ where: { category_id: entity_id.id } });
	}

	async findById(entity_id: Uuid): Promise<Category | null> {
		const model = await this.model.findByPk(entity_id.id);

		if (!model) {
			return null;
		}

		return new Category({
			category_id: new Uuid(model.category_id),
			name: model.name,
			is_active: model.is_active,
			created_at: model.created_at,
			description: model.description || undefined,
		});
	}

	async findAll(): Promise<Category[]> {
		const models = await this.model.findAll();

		return models.map(
			(model) =>
				new Category({
					category_id: new Uuid(model.category_id),
					name: model.name,
					is_active: model.is_active,
					created_at: model.created_at,
					description: model.description || undefined,
				}),
		);
	}

	async search(props: CategorySearchInput): Promise<CategorySearchResult> {
		const offset = (props.page - 1) * props.per_page;
		const limit = props.per_page;

		const { rows: models, count } = await this.model.findAndCountAll({
			...(props.filter && {
				where: {
					name: { [Op.like]: `%${props.filter}%` },
				},
			}),
			...(props.sort && this.sortableFields.includes(props.sort)
				? { order: [[props.sort, props.sort_dir ?? 'asc']] }
				: { order: [['created_at', 'desc']] }),
			offset,
			limit,
		});

		return new CategorySearchResult({
			items: models.map(
				(model) =>
					new Category({
						category_id: new Uuid(model.category_id),
						name: model.name,
						is_active: model.is_active,
						created_at: model.created_at,
						description: model.description || undefined,
					}),
			),
			current_page: props.page,
			per_page: props.per_page,
			total: count,
		});
	}

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	getEntity(): new (...args: any[]) => Category {
    return Category;
	}
}
