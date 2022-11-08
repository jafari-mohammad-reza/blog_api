import {IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches} from "class-validator";
import {Exclude} from "class-transformer";
import {UserRole} from "../models/user.interface";
import {ApiBody, ApiHeader, ApiProperty} from "@nestjs/swagger";
export class UpdateUserDto{
    @IsString()
    @IsOptional()
    @Length(8,16)
    @ApiProperty({required:false,name:"username",type:"string"})
    username:string;
    @IsString()
    @IsOptional()
    @IsEmail()
    @ApiProperty({required:false,name:"email",type:"string"})
    email:string;
    @IsString()
    @IsOptional()
    @Length(8,16)
    @ApiProperty({required:false,name:"password",type:"string"})
    password:string;
    @IsEnum(UserRole)
    @IsOptional()
    @ApiProperty({required:false,name:"role",type:"enum" ,enum:UserRole,default:UserRole.USER})
    role:UserRole;
    @IsInt()
    @IsOptional()
    @ApiProperty({required:false,name:"resetPassword_attempts",type:"integer"})
    resetPassword_attempts:number;
    @IsOptional()
    @ApiProperty({required:false,name:"file",type:"string",format:"binary"})
    file:Express.Multer.File;
}
