import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards, UseInterceptors} from '@nestjs/common';
import {Serialize} from "../interceptors/serialization.interceptor";
import UserDto from "./dtos/user.dto";
import {UserService} from "./user.service";
import {CreateUserDto} from "./dtos/create-user.dto";
import {UpdateUserDto} from "./dtos/update-user.dto";
import {ApiBody, ApiConsumes, ApiTags} from "@nestjs/swagger";
import {from, map, switchMap} from "rxjs";


@Controller('user')
@Serialize(UserDto)
@ApiTags("Users")
export class UserController {
    constructor(private readonly userService: UserService) {
    }

    @Get()
    // @hasRoles(UserRole.ADMIN)
    getAllUsers() {
        return this.userService.findAll()
    }

    @Get(":id")
    getUserById(@Param("id") id: string) {
        return this.userService.findById(id)
    }

    @Post()
    @ApiBody({type: CreateUserDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    createUser(@Body() user: CreateUserDto) {
        return this.userService.createUser(user).pipe(source => {
            return source.pipe(switchMap(value => {
                return value
            }))
        })

    }

    @Put(":id")
    @ApiBody({type: UpdateUserDto})
    @ApiConsumes("application/x-www-form-urlencoded")
    async updateUser(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return (await this.userService.updateOne(id ,body)).pipe(map(result => {
            return "Updated successfully"
        }))
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string) {
        return (await this.userService.deleteOne(id)).pipe(map(result => {
            return "Deleted successfully"
        }))
    }

}
