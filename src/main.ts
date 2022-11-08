import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import helmet from "helmet";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as cookieParser from 'cookie-parser';
import {RoleGuard} from "./guards/role-guard/role.guard";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  app.use(helmet({
    frameguard:true,
    hsts:{maxAge:2},
    contentSecurityPolicy:true,
    xssFilter:true,
    ieNoOpen:true,
    crossOriginResourcePolicy:false,
  }))
  app.use(cookieParser())
  app.useGlobalGuards(new RoleGuard(app.get(Reflector)));
  const config = new DocumentBuilder()
      .setTitle('Blog App API')
      .setDescription('Blog App API description')
      .setVersion('3.0')
      .addTag('Blogs')
      .addServer('http://localhost:3000')
      .addBearerAuth()
      .addCookieAuth()
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(3000);
}

bootstrap();
