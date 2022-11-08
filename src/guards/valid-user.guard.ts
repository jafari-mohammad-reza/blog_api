import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {map, Observable} from 'rxjs';

import {UserService} from "../user/user.service";
import {User} from "../user/models/user.interface";

@Injectable()
export class ValidUserGuard implements CanActivate {
    constructor(private userService:UserService) {
    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const requestUser = request.user
        const params = request.params
       return this.userService.findById(requestUser.id).pipe(map((user:User) => {
            let hasPermission = false;
            if(user.id === Number(params.id)){
                hasPermission=true
            }
            return  user && hasPermission
        }))
    }
}
