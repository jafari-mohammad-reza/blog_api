import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {ConfigModule, ConfigService} from "@nestjs/config";
import path from "path";

@Module({
  imports : [
      ConfigModule.forRoot({isGlobal:true}),
      MailerModule.forRootAsync({
        imports : [ConfigModule],
        inject:[ConfigService],
        useFactory: (configService:ConfigService) => ({
          transport:{
            service:"gmail",
            from:"Blog_App",
            auth: {
              user: configService.get("EMAIL_USER"),
              pass: configService.get("EMAIL_PASSWORD"),
            },
          },
          defaults:{
            from:"API_BLOG"
          },
        })
      })
  ],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
