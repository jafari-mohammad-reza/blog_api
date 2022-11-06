import {BadRequestException, MiddlewareConsumer, Module, NestModule} from '@nestjs/common';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import {UserEntity} from "./user/models/user.entity";
import { AuthModule } from './auth/auth.module';
import {ThrottlerModule} from "@nestjs/throttler";
import { MailModule } from './mail/mail.module';
import {CurrentUserMiddleware} from "./middlewares/current-user/current-user.middleware";
import {JwtService} from "@nestjs/jwt";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal:true }),
      TypeOrmModule.forRoot({
          type:"postgres",
          url:`postgresql://admin:admin@localhost:5432/Blog_App`,
          entities : [UserEntity],
          synchronize:true
      }),
      ThrottlerModule.forRoot({
          ttl:60,
          limit:10,
      }),
      TypeOrmModule.forFeature([UserEntity]),
    UserModule,
      AuthModule,
      MailModule
  ],
    providers:[JwtService]

})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(CurrentUserMiddleware).forRoutes("auth")
    }
}
