import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class ForgotPasswordDto{
    @IsEmail()
    @IsString()
    @ApiProperty({required:true,name:"email",type:"string"})
    email:string;
}
