import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { ProduitModule } from './produit/produit.module';
import { OrderitemModule } from './orderitem/orderitem.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    ProduitModule,
    OrderitemModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
