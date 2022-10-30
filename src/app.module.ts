import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm";
@Module({
  imports: [
      ConfigModule.forRoot({isGlobal:true }),
      TypeOrmModule.forRoot({
          type:"postgres",
          host:"localhost",
          port:5432,
          database:process.env.DATA_BASE,
          username:process.env.POSTGRES_USER,
          password:process.env.POSTGRES_PASSWORD,
          entities : [__dirname + "../**/*.entity{.ts,.js}"],
          synchronize:process.env.MODE != "production"
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
