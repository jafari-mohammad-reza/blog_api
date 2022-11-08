import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogEntity} from "./models/blog.entity";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";

@Module({
  imports:[TypeOrmModule.forFeature([BlogEntity]),AuthModule,UserModule],
  controllers: [BlogController],
  providers: [BlogService]
})
export class BlogModule {}
