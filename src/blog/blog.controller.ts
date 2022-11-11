import {
    Body,
    Controller, Delete,
    FileTypeValidator,
    Get,
    MaxFileSizeValidator,
    Param,
    ParseFilePipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {BlogService} from "./blog.service";
import {CreateBlogDto} from "./dtos/create-blog.dto";
import {CurrentUser} from "../decorators/current-user.decorator";
import {User} from "../user/models/user.interface";
import {FileInterceptor} from "@nestjs/platform-express";
import {map} from "rxjs";
import {UpdateBlogDto} from "./dtos/update-blog.dto";
import {ValidAuthorGuard} from "../guards/valid-author.guard";
import {UserEntity} from "../user/models/user.entity";

@Controller('blog')
@ApiTags("Blogs")
export class BlogController {
    constructor(private readonly blogService: BlogService) {
    }

    @Get()
    @ApiQuery({name: "user", required: false, type: "string", description: "id of user/author"})
    async getAll(@Query("user") userID: string) {
        return this.blogService.findAll(userID && Number(userID))
    }

    @Get("published")
    async getPublished(@Query("user") userID: string) {
        return this.blogService.findPublished()
    }

    @Get(":id")
    @ApiParam({name: "id", required: true, type: "string"})
    async getById(@Param("id") id: string) {
        return this.blogService.findById(id)
    }

    @Post()
    @ApiBody({type: CreateBlogDto, required: true})
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    createBlog(@Body() body: CreateBlogDto, @CurrentUser() user: UserEntity, @UploadedFile(new ParseFilePipe({
        validators: [new MaxFileSizeValidator({maxSize: 3000000}) // 3 megabytes
            , new FileTypeValidator({fileType: ".png"})
        ]
    })) file: Express.Multer.File) {
        console.log(user)
        body.file = file
        return this.blogService.createOne(user, body).pipe(map(value => {
            return value
        }))
    }
    @Post(":id")
    @ApiParam({name: "id", required: true, type: "string"})
    async likeBlog(@CurrentUser() user:User,@Param("id") id:string) {
        return await this.blogService.likeOrDislikeOne(id,user)
    }

    @Put(":id")
    @ApiBody({type: UpdateBlogDto, required: true})
    @ApiParam({name: "id", required: true, type: "string"})
    @ApiConsumes("multipart/form-data")
    @UseInterceptors(FileInterceptor("file"))
    @UseGuards(ValidAuthorGuard)
    async updateBlog(@Body() body: UpdateBlogDto, @Param("id") id: string, @UploadedFile(new ParseFilePipe({
        validators: [new MaxFileSizeValidator({maxSize: 3000000}) // 3 megabytes
            , new FileTypeValidator({fileType: ".png"})
        ]
    })) file: Express.Multer.File) {
        console.log(id)
        body.file = file
        return await this.blogService.updateOne(id,body)
    }
    @Delete(":id")
    @ApiParam({name: "id", required: true, type: "string"})
    @UseGuards(ValidAuthorGuard)
    async deleteBlog(@Param("id") id: string) {
        return await this.blogService.deleteOne(id)
    }
}
