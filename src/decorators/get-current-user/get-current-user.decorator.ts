import {createParamDecorator, ExecutionContext, SetMetadata} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {AuthService} from "../../auth/auth.service";

export const GetCurrentUser = createParamDecorator((tokenName:string,ctx:ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers
    const cookie = headers.cookie.split(`${tokenName}=`)[1].split(';')[0];

})
