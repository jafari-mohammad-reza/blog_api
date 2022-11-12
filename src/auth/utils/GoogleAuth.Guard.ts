import {AuthGuard} from "@nestjs/passport";
import {ExecutionContext, Injectable} from "@nestjs/common";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google'){
    constructor() {
        super({
            accessType: 'offline',
        });
    }
    async canActivate(context:ExecutionContext) {
        return (await super.canActivate(context)) as boolean;

    }
}
