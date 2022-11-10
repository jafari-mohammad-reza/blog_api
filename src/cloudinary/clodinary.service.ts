import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<{url:string,publicId:string}> {

        return new Promise((resolve, reject) => {
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve({url : result.url , publicId : result.public_id});
            });

            toStream(file.buffer).pipe(upload);
        });
    }
    async removeImage(publicId:string){
        return await v2.uploader.destroy(publicId)
    }
}
