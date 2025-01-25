import { InvalidUuidError, Uuid } from '../uuid.vo';
import { validate as uuidValidate } from 'uuid';

describe('Uuid Value Object', () => {
	// biome-ignore lint: Spy on private method
	const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

	test('should throw an error when id is invalid', () => {
		expect(() => {
			new Uuid('ivalid_uuid');
		}).toThrow(new InvalidUuidError());
		expect(validateSpy).toHaveBeenCalledTimes(1);
	});

	test('should create a valid uuid', () => {
		const uuid = new Uuid();
		expect(uuid.id).toBeDefined();
		expect(uuidValidate(uuid.id)).toEqual(true);
		expect(validateSpy).toHaveBeenCalledTimes(1);
	});

	test('should create a UUID with the provided value', () => {
		const uuid = new Uuid('101690d4-d16a-4c6a-8d59-a8f36dd226e5');
		expect(uuid.id).toEqual('101690d4-d16a-4c6a-8d59-a8f36dd226e5');
		expect(validateSpy).toHaveBeenCalledTimes(1);
	});
});
