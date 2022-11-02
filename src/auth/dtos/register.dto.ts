import {IsEmail, IsString, Length, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Match} from "../../decorators/match/match.decorator";

export class RegisterDto{
    @IsString()
    @IsEmail()
    @ApiProperty({required:true,type:"string",name:"email"})
    email:string;
    @IsString()
    @Length(8,16)
    @ApiProperty({required:true,type:"string",name:"username"})
    username:string;
    @IsString()
    @Length(8,16)
    @ApiProperty({required:true,type:"string",name:"password"})
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
    password:string;
    @IsString()
    @Length(8,16)
    @Match('password',{message:"passwords does not match"})
    @ApiProperty({required:true,type:"string",name:"confirmPassword"})
    confirmPassword:string;
}
