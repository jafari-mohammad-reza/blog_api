import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {join} from "path"
import {JwtModule, JwtService} from "@nestjs/jwt";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../user/models/user.entity";
import {MailService} from "../mail/mail.service";
import * as fs from "fs";
@Module({
  imports : [
      JwtModule.register({
        signOptions: {algorithm:"RS256"},
        publicKey:fs.readFileSync(join(__dirname,"..","..","jwtRS256.key.pub"),{encoding:'utf-8'}),
        privateKey:fs.readFileSync(join(__dirname,"..","..","jwtRS256.key"),{encoding:'utf-8'})
      }),
      TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService,MailService],
})
export class AuthModule {}
