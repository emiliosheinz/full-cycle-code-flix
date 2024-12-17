import { Uuid } from '../../shared/domain/value-objects/uuid.vo';

export type CategoryConstructorProps = {
	category_id?: Uuid;
	name: string;
	description?: string;
	is_active?: boolean;
	created__at?: Date;
};

export type CategoryCreateCommand = {
	name: string;
	description?: string;
	is_active?: boolean;
};

export class Category {
	category_id: Uuid;
	name: string;
	description: string | null;
	is_active: boolean;
	created__at: Date;

	constructor(props: CategoryConstructorProps) {
		this.category_id = props.category_id ?? new Uuid();
		this.name = props.name;
		this.description = props.description ?? null;
		this.is_active = props.is_active ?? true;
		this.created__at = props.created__at ?? new Date();
	}

	static create(props: CategoryCreateCommand): Category {
		return new Category(props);
	}

	changeName(name: string): void {
		this.name = name;
	}

	changeDescription(description: string): void {
		this.description = description;
	}

	activate() {
		this.is_active = true;
	}

	deactivate() {
		this.is_active = false;
	}

	toJSON() {
		return {
			category_id: this.category_id.id,
			name: this.name,
			descriptio: this.description,
			is_active: this.is_active,
			created_at: this.created__at,
		};
	}
}
