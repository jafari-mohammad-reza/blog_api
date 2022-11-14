import {BadRequestException, CACHE_MANAGER, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {BlogEntity} from "./models/blog.entity";
import {Repository} from "typeorm";
import {User} from "../user/models/user.interface";
import {CloudinaryService} from "../cloudinary/clodinary.service";
import {Observable, of, switchMap} from "rxjs";
import slugify from "slugify";
import {UserEntity} from "../user/models/user.entity";
import {CreateBlogDto} from "./dtos/create-blog.dto";
import {UpdateBlogDto} from "./dtos/update-blog.dto";
import {Cache} from "cache-manager";
import {Blog} from "./models/blog";

@Injectable()
export class BlogService {
    constructor(@InjectRepository(BlogEntity) private readonly blogRepository: Repository<BlogEntity>, private cloudinaryService: CloudinaryService,@Inject(CACHE_MANAGER) private cachingService:Cache) {
    }

    async findAll(author: number | undefined) {
        return await this.blogRepository.find(author && {
            where: {author: {id: author}},
            relations: ["author"],
            select: {author: {id: true, username: true}}
        })
    }
    async findPublished(take:number=30,skip:number=0){
        return await this.blogRepository.find({where:{isPublished:true} ,
            relations:["author"],select:{author:{id:true,username:true}} ,
            order:{updated:{direction:"asc"}},
            take,
            skip,
        } )

    }
    async findById(id:string) : Promise<any> {
        const cachedBlog = await this.cachingService.get(id)
        if(cachedBlog){
            return cachedBlog
        }
        const blog = await this.blogRepository.findOne({
            where: {id},
            relations: ["author"],
            select: {author: {id: true, username: true}}
        }).catch(() => {
            throw new BadRequestException("Not a valid id")
        })
        if (!blog) throw new NotFoundException("There is no blog with this id")
        await this.cachingService.set(id,blog)
        return blog

    }
    createOne(author:UserEntity,blog:CreateBlogDto) {
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
        if(await this.cachingService.get(id)){
            await this.cachingService.del(id)
        }
        return await this.blogRepository.update(id,blog)
    }
    async deleteOne(id:string){
        const blog = await this.findById(id)
        await this.cloudinaryService.removeImage(blog.headerImage.publicId)
        if(await this.cachingService.get(id)){
            await this.cachingService.del(id)
        }
        return await this.blogRepository.delete(id)
    }
    async likeOrDislikeOne(id:string,user:User){
        let {likes} = await this.findById(id)
        if(likes.includes(user.id)){
            likes = likes.filter(id => id !== user.id)
        }else{
            likes.push(user.id)
        }
        if(await this.cachingService.get(id)){
            await this.cachingService.del(id)
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
