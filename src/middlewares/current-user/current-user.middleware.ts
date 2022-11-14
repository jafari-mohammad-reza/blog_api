import {BadRequestException, Injectable, NestMiddleware, UnauthorizedException} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../user/models/user.entity";
import {Repository} from "typeorm";
import {readFileSync} from "fs";
import {join} from "path";

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private jwtService :JwtService,@InjectRepository(UserEntity) private userRepository:Repository<UserEntity>) {
  }
   async use(req: any, res: any, next: () => void) {
    const accessToken =req.headers.cookie?.split("access_token=")[1]?.split(";")[0]
       if(!accessToken) throw new UnauthorizedException("Please login first")
    const encoded = await this.jwtService.verifyAsync(accessToken,{algorithms:["RS256"],publicKey:readFileSync(join(__dirname,"..","..","..","jwtRS256.key.pub"),{encoding:"utf-8"})})

    req.user = await this.userRepository.findOne({where: {email: encoded}, select: {email: true, username: true, id: true,role:true}})
    next();
  }
}
