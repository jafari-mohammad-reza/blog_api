import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./models/user.entity";
import {Repository, UpdateResult} from "typeorm";
import {from, map, Observable, ObservedValueOf, switchMap} from "rxjs";
import {User} from "./models/user.interface";
import {AuthService} from "../auth/auth.service";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";
import * as fs from "fs";
import path, {join} from "path";
import {log} from "util";

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>, private readonly authService: AuthService) {
    }

    createUser(user: User): Observable<Observable<UserEntity>> {
        return this.authService.hashPassword(user.password).pipe(switchMap(async (hashedPassword, index) => {
            const {email, role, username} = user
            const existUsers = await this.repository.find({where: [{username}, {email}]})
            if(existUsers.length){
                throw new BadRequestException("Exist user.")
            }
            const newUser = this.repository.create({email,role,username,password:hashedPassword})
            return from(this.repository.save(newUser))

        }))
     }
    findAll() :Observable<User[]> {
        return from(this.repository.find())
    }

    findById(id: string | number) {
        return from(this.repository.findOneBy({id: Number(id)})).pipe(
            map((user: User) => {
                if (!user) {
                    throw new NotFoundException("user does not exist")
                }
                return user
            })
        )
    }


     async paginate(options:IPaginationOptions) {
         console.log(await paginate<UserEntity>(this.repository , options))
         return await paginate<UserEntity>(this.repository , options)
    }


    async updateOne(id: string|number, attr: Partial<User>): Promise<Observable<Observable<ObservedValueOf<Promise<UpdateResult>>>>> {
        if(attr.email || attr.username){
            const existUsers = await this.repository.find({where: [{username: attr.username}, {email: attr.email}]})
            if (existUsers.length) {
                throw new BadRequestException("Exist user.")
            }
        }
        return this.findById(id).pipe(map((user: User) => {
            if (user.profileImage) {
                const filePath = join(process.cwd(), "uploads", "profileImages", user.profileImage);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }
            const newUser = Object.assign(user, attr)
            return from(this.repository.update(id, newUser)).pipe(map(result => {
                if (result.affected === 0) {
                    throw new BadRequestException("no user deleted")
                }
                return result
            }))
        }))
    }
    async deleteOne(id:string|number):Promise<Observable<any>>{
        return (await this.findById(id)).pipe(source => {
            return from(this.repository.delete(Number(id))).pipe(map(result => {
                if(result.affected === 0){
                    throw new BadRequestException("no user deleted")
                }
                return result
            }));
        });

    }
    async uploadProfile(id:string|number,profileImage:string){
        const user = await this.repository.findOneBy({id : Number(id)})
        if(!user) throw new BadRequestException("There is no user with this id")
        if (user.profileImage) {
            const filePath = join(process.cwd(), "uploads", "profileImages", user.profileImage);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        await this.repository.update(id, {profileImage});
    }
}
