import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./models/user.entity";
import {AuthModule} from "../auth/auth.module";
import {AuthService} from "../auth/auth.service";
import {JwtService} from "@nestjs/jwt";
import {MailService} from "../mail/mail.service";

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),AuthModule],
  controllers: [UserController],
  providers: [UserService,AuthService,JwtService,MailService]
})
export class UserModule {}
