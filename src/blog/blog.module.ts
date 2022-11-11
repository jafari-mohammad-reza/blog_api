import {CacheModule, Module} from '@nestjs/common';
import {BlogController} from './blog.controller';
import {BlogService} from './blog.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {BlogEntity} from "./models/blog.entity";
import {AuthModule} from "../auth/auth.module";
import {UserModule} from "../user/user.module";
import {CloudinaryModule} from "../cloudinary/cloudinary.module";
import {ValidAuthorGuard} from "../guards/valid-author.guard";

@Module({
  imports:[TypeOrmModule.forFeature([BlogEntity]),AuthModule,UserModule,CloudinaryModule],
  controllers: [BlogController],
  providers: [BlogService,ValidAuthorGuard],
  exports:[ValidAuthorGuard]
})
export class BlogModule {}
