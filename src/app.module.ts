import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import {ConfigModule} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from './user/user.module';
import {UserEntity} from "./user/models/user.entity";
import {AuthModule} from './auth/auth.module';
import {ThrottlerModule} from "@nestjs/throttler";
import {MailModule} from './mail/mail.module';
import {CurrentUserMiddleware} from "./middlewares/current-user/current-user.middleware";
import {JwtService} from "@nestjs/jwt";
import {BlogModule} from './blog/blog.module';
import {BlogEntity} from "./blog/models/blog.entity";
import {CloudinaryModule} from './cloudinary/cloudinary.module';

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal:true }),
      TypeOrmModule.forRoot({
          type:"postgres",
          url:`postgresql://admin:admin@localhost:5432/Blog_App`,
          entities : [UserEntity,BlogEntity],
          synchronize:true
      }),
      ThrottlerModule.forRoot({
          ttl:60,
          limit:10,
      }),
      TypeOrmModule.forFeature([UserEntity]),
    UserModule,
      AuthModule,
      MailModule,
      BlogModule,
      CloudinaryModule,
  ],
    providers:[JwtService]

})
export class AppModule implements NestModule{
    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(CurrentUserMiddleware).forRoutes("user",{path:"auth",method:RequestMethod.GET},"blog")
    }
}
