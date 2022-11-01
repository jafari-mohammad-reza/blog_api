import { Injectable } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {User} from "../user/models/user.interface";
import {from, Observable} from "rxjs";
import * as argon2 from "argon2";
@Injectable()
export class AuthService {
    constructor(private readonly jwtService:JwtService) {
    }
    generateJwt(user:User,expiresIn:string="7days"):Observable<String>{
        return from(this.jwtService.sign(user,{expiresIn}))
    }
     hashPassword(password:string):Observable<string>{
        return from(argon2.hash(password))
    }
    compareHashedPassword(password:string,hashedPassword:string):Observable<any|boolean>{
        return from<any|boolean>(argon2.verify(password,hashedPassword))
    }
}
