import { Config } from '../config';
import * as dotenv from 'dotenv';
import * as path from 'node:path';

jest.mock('dotenv');
jest.mock('node:path');

describe('Config', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		Config.env = null;
	});

	describe('readEnv', () => {
		it('should read environment variables from file', () => {
			const mockParsed = { DB_HOST: 'localhost', DB_LOGGING: 'true' };
			(dotenv.config as jest.Mock).mockReturnValue({ parsed: mockParsed });

			Config.readEnv();

			expect(dotenv.config).toHaveBeenCalledWith({
				path: path.resolve(`envs/.env.${process.env.NODE_ENV}`),
			});
			expect(Config.env).toEqual(mockParsed);
		});

		it('should throw an error if dotenv fails', () => {
			const mockError = new Error('dotenv error');
			(dotenv.config as jest.Mock).mockReturnValue({ error: mockError });

			expect(() => Config.readEnv()).toThrow(mockError);
		});

		it('should not read environment variables if already set', () => {
			Config.env = { DB_HOST: 'localhost' };

			Config.readEnv();

			expect(dotenv.config).not.toHaveBeenCalled();
		});
	});

	describe('db', () => {
		it('should return database configuration', () => {
			Config.env = { DB_HOST: 'localhost', DB_LOGGING: 'true' };

			const dbConfig = Config.db();

			expect(dbConfig).toEqual({
				dialect: 'sqlite',
				host: 'localhost',
				logging: true,
			});
		});
	});
});
