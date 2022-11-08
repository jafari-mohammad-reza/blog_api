import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import {Reflector} from "@nestjs/core";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector:Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>("roles",context.getHandler())
    if(!roles) return true
    const request = context.switchToHttp().getRequest()
    const user   =request.user;
    const hasRole = () => roles.indexOf(user.role) > -1;
    let hasPermission: boolean = false;
    if (hasRole()) {
      hasPermission = true;
    };
    return user && hasPermission;
  }
}
