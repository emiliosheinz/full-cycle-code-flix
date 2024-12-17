import { ValueObject } from '../domain/value-object';

class StubValueObject extends ValueObject {
	constructor(readonly value: string) {
		super();
	}
}

class Stub2ValueObject extends ValueObject {
	constructor(readonly value: string) {
		super();
	}
}

describe('ValueObject', () => {
	test('should be equals when props are the same', () => {
		const valueObject1 = new StubValueObject('mock');
		const valueObject2 = new StubValueObject('mock');
		expect(valueObject1.equals(valueObject2)).toEqual(true);
	});

	test('should not be equals when props are the different', () => {
		const valueObject1 = new StubValueObject('mock');
		const valueObject2 = new StubValueObject('mock1');
		expect(valueObject1.equals(valueObject2)).toEqual(false);
	});

	test('should not be equals when null', () => {
		const valueObject1 = new StubValueObject('mock');
		expect(valueObject1.equals(null as any)).toEqual(false);
	});

	test('should not be equals when constructors are different', () => {
		const valueObject1 = new StubValueObject('mock');
		const valueObject2 = new Stub2ValueObject('mock');
		expect(valueObject1.equals(valueObject2)).toEqual(false);
	});
});
