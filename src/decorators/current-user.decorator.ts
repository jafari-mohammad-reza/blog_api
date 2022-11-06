import {createParamDecorator, ExecutionContext} from '@nestjs/common';
import {isJWT} from "class-validator";
import {AuthService} from "../auth/auth.service";


export const CurrentUser = createParamDecorator((data:never, context: ExecutionContext) => {
    return context.switchToHttp().getRequest().user
})
