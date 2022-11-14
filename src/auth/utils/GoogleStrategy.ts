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
            scope: ['profile', 'email'],
        });
    }
    async validate(
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: VerifyCallback,
    ){
        const { id, name, emails, photos } = profile;

        const user = {
            provider: 'google',
            providerId: id,
            email: emails[0].value,
            name: `${name.givenName} ${name.familyName}`,
            picture: photos[0].value,
        };

        done(null, user);
    }
}
