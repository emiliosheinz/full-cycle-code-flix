import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { configDatabaseSchema, ConfigModule } from '../config.module';

describe('ConfigModule', () => {
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configService).toBeDefined();
  });

  it('should validate environment variables', () => {
    const envConfig = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_PORT: 3306,
      DB_USERNAME: 'root',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'test',
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true,
    };

    const { error } = Joi.object(configDatabaseSchema).validate(envConfig);
    expect(error).toBeUndefined();
  });

  it('should throw validation error for invalid environment variables', () => {
    const envConfig = {
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_PORT: 'invalid_port',
      DB_USERNAME: 'root',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'test',
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true,
    };

    const { error } = Joi.object(configDatabaseSchema).validate(envConfig);
    expect(error).toBeDefined();
  });
});
