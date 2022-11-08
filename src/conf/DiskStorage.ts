import {diskStorage} from "multer";
import {parse} from "path";
import {v4 as uuid4} from "uuid";

export  const  defaultStorage =  diskStorage({
    destination : "./uploads/profileImages",
    filename(req: Express.Request, file: Express.Multer.File, callback: (error: (Error | null), filename: string) => void) {

        const extension = parse(file.originalname).ext
        const validFileExtensions=[".png",".jpeg",".jpg",'.svg']
        if(file.size > 4000) {
            callback({name:"File error" ,message:"File should be less than 4mb"} , null)
        }
        if(!validFileExtensions.includes(extension)) {
            callback({name:"File error" ,message:"not a valid file"} , null)
        }
        const fileName = parse(file.originalname).name.replace(/\s/g , "").concat(uuid4())
        callback(null , `${fileName+extension}`)
    }
})
