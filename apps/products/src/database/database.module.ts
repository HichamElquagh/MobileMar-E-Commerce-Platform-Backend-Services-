import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from '../brands/models/brand.model';
import { Category } from '../categories/models/category.model';
import { Image } from '../images/models/image.model';
import { Product } from '../products/models/product.model';
import { ProductCategory } from '../products/models/productCategory.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          dialect: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          models: [Product, Category, ProductCategory, Brand, Image],
          autoLoadModels: true,
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
