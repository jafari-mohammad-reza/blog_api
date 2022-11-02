import {BadRequestException, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule, ConfigService} from "@nestjs/config"
import {TypeOrmModule} from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import {UserEntity} from "./user/models/user.entity";
import { AuthModule } from './auth/auth.module';
import {ThrottlerModule} from "@nestjs/throttler";
import { MailModule } from './mail/mail.module';
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
    UserModule,
      AuthModule,
      MailModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
