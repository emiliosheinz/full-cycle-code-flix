import { NotFoundError } from '../not-found.error';
import { Entity } from '../../entity';
import { ValueObject } from '../../value-object';

class TestEntity extends Entity {
	get entity_id(): ValueObject {
		throw new Error('Method not implemented.');
	}
	toJSON(): Record<string, unknown> {
		throw new Error('Method not implemented.');
	}
}

class TestValueObject extends ValueObject {}

describe('NotFoundError', () => {
	it('should create an instance with a single id', () => {
		const id = new TestValueObject();
		const error = new NotFoundError(id, TestEntity);
		expect(error).toBeInstanceOf(NotFoundError);
		expect(error.message).toBe(
			'TestEntity with id [object Object] does not exist',
		);
		expect(error.name).toBe('NotFoundError');
	});

	it('should create an instance with multiple ids', () => {
		const ids = [new TestValueObject(), new TestValueObject()];
		const error = new NotFoundError(ids, TestEntity);
		expect(error).toBeInstanceOf(NotFoundError);
		expect(error.message).toBe(
			'TestEntity with id [object Object], [object Object] does not exist',
		);
		expect(error.name).toBe('NotFoundError');
	});
});
