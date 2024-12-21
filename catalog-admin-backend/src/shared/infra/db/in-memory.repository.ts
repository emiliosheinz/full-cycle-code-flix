import type { Entity } from '../../domain/entity';
import { NotFoundError } from '../../domain/errors/not-found.error';
import type { IRespository } from '../../domain/repository/repository-interface';
import type { ValueObject } from '../../domain/value-object';

export abstract class InMemoryRepository<
  E extends Entity,
  I extends ValueObject,
> implements IRespository<E, I> {
  items: E[] = [];

  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );

    if (itemIndex === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity()); 
    }

    this.items[itemIndex] = entity;
  }

  async delete(entity_id: I): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.entity_id.equals(entity_id),
    );

    if (itemIndex === -1) {
      throw new NotFoundError(entity_id, this.getEntity());
    }

    this.items.splice(itemIndex, 1);
  }

  async findById(entity_id: I): Promise<E | null> {
    const item = this.items.find((item) => item.entity_id.equals(entity_id));
    return item || null;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }

	// biome-ignore lint/suspicious/noExplicitAny: This is a generic method 
	abstract getEntity(): new (...args: any[]) => E;
}
