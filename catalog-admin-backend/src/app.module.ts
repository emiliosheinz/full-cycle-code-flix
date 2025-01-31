import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from './config/config.module';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		CategoriesModule,
		ConfigModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
