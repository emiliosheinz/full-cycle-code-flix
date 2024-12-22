import { faker } from '@faker-js/faker';
import { Entity } from '../../domain/entity';
import type { ValueObject } from '../../domain/value-object';
import { Uuid } from '../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from './in-memory.repository';
import { NotFoundError } from '../../domain/errors/not-found.error';

class StubEntity extends Entity {
  id: Uuid = new Uuid();
  name = faker.person.fullName();

  get entity_id(): ValueObject {
    return this.id;
  }

  toJSON(): Record<string, unknown> {
    return {
      id: this.id.id,
      name: this.name,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: unknown[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  test('should insert successfully', async () => {
    const entity = new StubEntity();

    await repository.insert(entity);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]).toEqual(entity);
  });

  test('should bulk insert successfully', async () => {
    const entities = Array.from({ length: 3 }, () => new StubEntity());

    await repository.bulkInsert(entities);

    expect(repository.items).toHaveLength(3);
    expect(repository.items[0]).toEqual(entities[0]);
    expect(repository.items[1]).toEqual(entities[1]);
    expect(repository.items[2]).toEqual(entities[2]);
  });

  test('should update successfully', async () => {
    const entity = new StubEntity();
    repository.insert(entity);

    const newEntity = new StubEntity();
    newEntity.id = entity.id;

    repository.update(newEntity);

    expect(repository.items).toHaveLength(1);
    expect(repository.items[0]).toEqual(newEntity);
  });

  test('show throw an error while updating when entity is not found', async () => {
    const entity = new StubEntity();
    const newEntity = new StubEntity();

    repository.insert(entity);

    try {
      await repository.update(newEntity);
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
    }
  });

  test('should delete successfully', async () => {
    const entity = new StubEntity();
    repository.insert(entity);

    await repository.delete(entity.id);

    expect(repository.items).toHaveLength(0);
  })

  test('show throw an error while deleting when entity is not found', async () => {
    const entity = new StubEntity();
    repository.insert(entity);

    try {
      await repository.delete(new Uuid());
    } catch (e) {
      expect(e).toBeInstanceOf(NotFoundError);
    }
  });

  test('should find by id successfully', async () => {
    const entity = new StubEntity();
    repository.insert(entity);

    const foundEntity = await repository.findById(entity.id);

    expect(foundEntity).toEqual(entity);
  });

  test('should return null when entity is not found', async () => {
    const entity = new StubEntity();
    repository.insert(entity);

    const foundEntity = await repository.findById(new Uuid());

    expect(foundEntity).toBeNull();
  });

  test('should find all entities successfully', async () => {
    const entities = Array.from({ length: 3 }, () => new StubEntity());
    repository.bulkInsert(entities);

    const foundEntities = await repository.findAll();

    expect(foundEntities).toHaveLength(3);
    expect(foundEntities[0]).toEqual(entities[0]);
    expect(foundEntities[1]).toEqual(entities[1]);
    expect(foundEntities[2]).toEqual(entities[2]);
  });
});

