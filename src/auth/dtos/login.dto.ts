import {IsBoolean, IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginDto{
    @IsEmail()
    @IsString()
    @ApiProperty({name:"email",type:"string",required:true})
    email:string;
    @IsString()
    @ApiProperty({name:"password",type:"string",required:true})
    password:string;

    @ApiProperty({name:"rememberMe",type:"boolean",required:false})
    rememberMe:boolean;
}
