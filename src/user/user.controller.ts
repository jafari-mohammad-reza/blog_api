import {
    Body, CacheInterceptor, CacheTTL,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {Serialize} from "../interceptors/serialization.interceptor";
import UserDto from "./dtos/user.dto";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dtos/create-user.dto";
import {UpdateUserDto} from "./dtos/update-user.dto";
import {ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags} from "@nestjs/swagger";
import {map, switchMap} from "rxjs";

import {RoleGuard} from "../guards/role.guard";
import {hasRoles} from "../decorators/has-role.decorator";
import {User, UserRole} from "./models/user.interface";
import {FileInterceptor} from "@nestjs/platform-express";
import {defaultStorage} from "../conf/DiskStorage";
import {CurrentUser} from "../decorators/current-user.decorator";
import {UploadProfileDto} from "./dtos/upload-profile.dto";
import {ValidUserGuard} from "../guards/valid-user.guard";
import {UserEntity} from "./models/user.entity";
@UseGuards(RoleGuard)
@Controller('user')
@Serialize(UserDto)
@ApiTags("Users")
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    @ApiQuery({type:"number",name:"page",required:false,description:"the page you want to return"})
    @ApiQuery({type:"number",name:"limit",required:false,description:"number of users to return"})
    @hasRoles(UserRole.ADMIN)
    async getAllUsers(@Query("page") page=1,@Query("limit") limit=10) {
        limit = limit > 100 ? 100 : limit
        console.log(limit,page)
        return await this.userService.paginate({page,limit,route:`${process.env.APPLICATION_ADDRESS}/user`}).then(result => {
            return result.items
        })
    }

    @Get(":id")
    @ApiParam({name:"id",required:true,type:"string"})
    @hasRoles(UserRole.ADMIN)
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
    getUserById(@Param("id") id: string) {
        return this.userService.findById(id)
    }

    @Post()
    @ApiBody({type: CreateUserDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    @hasRoles(UserRole.ADMIN)
    createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user).pipe(source => {
            return source.pipe(switchMap(value => {
                return value
            }))
        })

    }

    @Put(":id")
    @ApiBody({type: UpdateUserDto})
    @ApiParam({name:"id",required:true,type:"string"})
    @ApiConsumes("multipart/form-data")
    @hasRoles(UserRole.USER,UserRole.CHIEFEDITOR,UserRole.ADMIN)
    @UseGuards(ValidUserGuard)
    @UseInterceptors(FileInterceptor("file" ,{storage:defaultStorage}))
    async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto,@UploadedFile() file:Express.Multer.File) {
        body.profileImage = file.originalname
        return (await this.userService.updateOne(id ,body)).pipe(map(result => {
            return "Updated successfully"
        }))
    }

    @Delete(":id")
    @ApiParam({name:"id",required:true,type:"string"})
    @hasRoles(UserRole.ADMIN)

    async deleteUser(@Param("id") id: string) {
        return (await this.userService.deleteOne(id)).pipe(map(result => {
            return "Deleted successfully"
        }))
    }
    @Post("upload_profile")
    @ApiConsumes("multipart/form-data")
    @ApiBody({type:UploadProfileDto})
    @UseInterceptors(FileInterceptor("file" ,{storage:defaultStorage}))
    async uploadProfile(@UploadedFile() file:Express.Multer.File,@CurrentUser()user:User){
        await this.userService.uploadProfile(user.id,file.filename)
        return "Profile uploaded successfully."
    }

}
