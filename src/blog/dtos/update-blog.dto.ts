import {IsBoolean, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateBlogDto{
    @IsString()
    @IsOptional()
    @Length(10,50)
    @ApiProperty({type:"string" ,required:false,name:"title"})
    title:string;
    @IsString()
    @IsOptional()
    @Length(50,350)
    @ApiProperty({type:"string" ,required:false,name:"content"})
    content:string;
    @IsString()
    @IsOptional()
    @ApiProperty({type:"string" ,required:false,name:"slug"})
    slug:string;
    @IsOptional()
    @ApiProperty({type:"boolean" ,required:false,name:"isPublished"})
    isPublished:boolean;
    @IsOptional()
    @ApiProperty({type:"string" ,required:false,format:"binary",name:"file"})
    file:Express.Multer.File
}
