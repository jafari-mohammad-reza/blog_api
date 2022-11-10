import {isNotEmpty, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateBlogDto{
    @IsString()
    @IsNotEmpty()
    @Length(10,50)
    @ApiProperty({type:"string" ,required:true,name:"title"})
    title:string;
    @IsString()
    @IsNotEmpty()
    @Length(50,350)
    @ApiProperty({type:"string" ,required:true,name:"content"})
    content:string;
    @ApiProperty({type:"string" ,required:true,format:"binary",name:"file"})
    file:Express.Multer.File
}
