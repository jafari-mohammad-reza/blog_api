import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {join} from "path"
import {JwtModule, JwtService} from "@nestjs/jwt";

@Module({
  imports : [
      JwtModule.register({
        signOptions: {expiresIn:"100s",algorithm:"RS256"},
        publicKey:join(__dirname,'..','..','jwtRS256.key.pub'),
        privateKey:join(__dirname,'..','..','jwtRS256.key')
      }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
