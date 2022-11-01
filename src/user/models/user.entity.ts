import {BaseEntity, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {UserRole} from "./user.interface";

@Entity()
export class UserEntity extends BaseEntity{
    @PrimaryGeneratedColumn({type:"int",name:"Id"})
    id:number;
    @Column({type:"varchar",name:"userName",unique:true  })
    username:string;
    @Column({type:"varchar",name:"email",unique:true})
    email:string;
    @Column({type:"varchar",name:"password"})
    password:string;
    @Column({type: 'enum', enum: UserRole, default: UserRole.USER})
    role: UserRole;
    @Column({type:"varchar",name:"access_token",default:''})
    access_token:string;
    @Column({type:"varchar",name:"refresh_token",default:''})
    refresh_token:string;
    @Column({type:"int",name:"resetPassword_attempts",default:0})
    resetPassword_attempts:number;
    // @OneToMany(type => BlogEntryEntity, blogEntryEntity => blogEntryEntity.author)
    // blogEntries: BlogEntryEntity[];
    //
    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
}