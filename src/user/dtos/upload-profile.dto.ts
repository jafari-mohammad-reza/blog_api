import {IsNotEmpty, IsOptional} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UploadProfileDto{
    @IsNotEmpty()
    @ApiProperty({required:false,name:"file",type:"string",format:"binary"})
    file:Express.Multer.File;
}
