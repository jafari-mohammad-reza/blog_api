import {Entity} from "typeorm";
import {UserEntity} from "./user.entity";


export interface User {
    email: string;
    followers?: string[];
    followings?: string[];
    id?: number;
    password: string;
    resetPassword_attempts?: number;
    role?: UserRole;
    username: string;
    isVerified?:boolean;
    profileImage?:string;
    // blogEntries?: BlogEntry[];
}


export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}
