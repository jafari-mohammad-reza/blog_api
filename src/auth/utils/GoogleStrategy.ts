import {PassportStrategy} from "@nestjs/passport";
import {Strategy,Profile,VerifyCallback} from "passport-google-oauth20";
import {Injectable} from "@nestjs/common";
import {AuthService} from "../auth.service";
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy,"google"){
    constructor(private readonly authService:AuthService) {
        super({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:`${process.env.APPLICATION_ADDRESS}/auth/google/redirect`,
            scope : ["email","profile"],
        });
    }
    async validate(accessToken:string,refreshToken:string,profile:Profile,done:VerifyCallback){
         await this.authService.validateOAuthUser(profile)
        done(null, {accessToken , refreshToken})
    }
}
