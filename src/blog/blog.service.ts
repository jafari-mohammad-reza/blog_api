import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "./models/blog.entity";
import {DeepPartial, FindOptionsWhere, Repository} from "typeorm";
import {User} from "../user/models/user.interface";
import {Blog} from "./models/blog";
import {CloudinaryService} from "../cloudinary/clodinary.service";
import {from, map, Observable, ObservedValueOf, of, switchMap} from "rxjs";
import slugify from "slugify";
import {UserEntity} from "../user/models/user.entity";
import {CreateBlogDto} from "./dtos/create-blog.dto";
import {UpdateBlogDto} from "./dtos/update-blog.dto";
import {use} from "passport";

@Injectable()
export class BlogService {
    constructor(@InjectRepository(BlogEntity) private readonly blogRepository :Repository<BlogEntity>,private cloudinaryService:CloudinaryService) {
    }
     async findAll(author : number |undefined){
        return await this.blogRepository.find(author && {where:{author :{id:author}},relations:["author"],select:{author:{id:true,username:true}} })
     }
    async findPublished(){
        return await this.blogRepository.find({where:{isPublished:true} , relations:["author"],select:{author:{id:true,username:true}}} )
    }
    async findById(id:string) : Promise<BlogEntity>{
        const blog = await this.blogRepository.findOne({where:{id},relations:["author"],select:{author:{id:true,username:true}}}).catch(() => {
            throw new BadRequestException("Not a valid id")
        })
        if(!blog) throw new NotFoundException("There is no blog with this id")
        return blog
    }
    createOne(author:UserEntity,blog:CreateBlogDto) {
        console.log(author)
        return this.generateSlug(blog.title).pipe(switchMap(async (slug:string) => {
            const uploadedImage =await this.uploadImageToCloudinary(blog.file)
            const blogEntry = {
                title:blog.title,
                slug,
                author,
                created:new Date(),
                publishedDate:new Date(),
                updated:new Date(),
                isPublished:true,
                content:blog.content,
                headerImage: uploadedImage,
            }
            return await  this.blogRepository.save(blogEntry)
        }))
    }
    async updateOne(id:string,body:UpdateBlogDto){
        let blog = await this.findById(id)
        if(body.file){
            await this.cloudinaryService.removeImage(blog.headerImage.publicId)
            blog.headerImage = await this.cloudinaryService.uploadImage(body.file)
        }
        blog.slug = body.slug ?  slugify(body.slug) : blog.slug
        blog.title = body.title ? body.title : blog.title
        blog.content = body.content ? body.content : blog.content
        blog.updated = new Date()
        return await this.blogRepository.update(id,blog)
    }
    async deleteOne(id:string){
        const blog = await this.findById(id)
        await this.cloudinaryService.removeImage(blog.headerImage.publicId)
        return await this.blogRepository.delete(id)
    }
    async likeOrDislikeOne(id:string,user:User){
        let {likes} = await this.findById(id)
        if(likes.includes(user.id)){
            likes = likes.filter(id => id !== user.id)
        }else{
            likes.push(user.id)
        }
        return await this.blogRepository.update(id,{likes})
    }
    async uploadImageToCloudinary(file: Express.Multer.File) {
        return await this.cloudinaryService.uploadImage(file).catch(() => {
            throw new BadRequestException('Invalid file type.');
        });
    }
    generateSlug(title:string) : Observable<string>{
        return of(slugify(title))
    }
}
