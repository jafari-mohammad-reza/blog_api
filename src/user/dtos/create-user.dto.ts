import {IsEmail, IsNotEmpty, IsString, Length,IsOptional} from "class-validator";
import {Exclude} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
export class CreateUserDto{
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({type:"string",required:true,name:"email",example:"email@gamil.com"})
    email:string;
    @IsString()
    @IsNotEmpty()
    @Length(8,16)
    @ApiProperty({type:"string",required:true,name:"username",example:"Mohammad"})
    username:string;
    @IsString()
    @IsNotEmpty()
    @Length(8,16)
    @ApiProperty({type:"string",required:true,name:"password",example:"StrongPassword"})
    password:string;
}
