import {BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException} from '@nestjs/common';
import { Observable} from 'rxjs';
import {BlogService} from "../blog/blog.service";
import {BlogEntity} from "../blog/models/blog.entity";
import {log} from "util";

@Injectable()
export class ValidAuthorGuard implements CanActivate {
    constructor(private blogService:BlogService) {
    }
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const requestUser = request.user
        const params = request.params
        return this.blogService.findById(params.id).then((blog:BlogEntity) => {
            return blog.author.id === Number(requestUser.id);
        }).catch(err => {
            throw new BadRequestException(err)
        })
    }
}
