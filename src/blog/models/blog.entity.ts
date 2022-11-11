import {BaseEntity, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "../../user/models/user.entity";

@Entity()
export class BlogEntity extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({type:"varchar",name:"title",unique:false,length:50})
    title:string;
    @Column({type:"varchar",name:"slug",unique:false})
    slug:string;
    @Column({type:"varchar",name:"content",unique:false})
    content:string;
    @Column({type:"timestamp",default: () => "CURRENT_TIMESTAMP",name:"created"})
    created:Date;
    @Column({type:"timestamp",default: () => "CURRENT_TIMESTAMP",name:"updated"})
    updated:Date;
    @Column({type:"timestamp",default: () => "CURRENT_TIMESTAMP",name:"publishedDate"})
    publishedDate:Date;
    @Column({type:"boolean",default:true,name:"isPublished"})
    isPublished:boolean;
    @Column({type:"int",array:true,name:"likes",default:[]})
    likes:number[];
    @Column({type:"simple-json",nullable:true,name:"headerImage"})
    headerImage:{url:string,publicId:string};
    @ManyToOne(type => UserEntity,user => user.id)
    author:UserEntity;
    @BeforeUpdate()
    updateTimeStamp(){
        this.updated = new Date;
    }

}
