import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigSchemaType } from 'src/config/config.module';

const models = [CategoryModel];

@Module({
	imports: [
		SequelizeModule.forRootAsync({
			useFactory: (configService: ConfigService<ConfigSchemaType>) => {
        switch (configService.get('DB_VENDOR')) {
          case 'sqlite':
            return {
              dialect: 'sqlite',
              host: configService.get('DB_HOST'),
              logging: configService.get('DB_LOGGING'),
              autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
              models,
            }
          case 'mysql':
            return {
              dialect: 'mysql',
              host: configService.get('DB_HOST'),
              port: configService.get('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              logging: configService.get('DB_LOGGING'),
              autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
              models,
            }
          default:
            throw new Error(`Unsupported database vendor: ${configService.get('DB_VENDOR')}`)
        }

      },
      inject: [ConfigService]
		}),
	],
})
export class DatabaseModule {}
