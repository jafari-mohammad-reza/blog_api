import {Entity} from "typeorm";
import {UserEntity} from "./user.entity";


export interface User {
    access_token?: string;
    email: string;
    followers?: string[];
    followings?: string[];
    id?: number;
    password: string;
    refresh_token?: string;
    resetPassword_attempts?: number;
    role?: UserRole;
    username: string;
    isVerified?:boolean;
    // blogEntries?: BlogEntry[];
}


export enum UserRole {
    ADMIN = 'admin',
    CHIEFEDITOR = 'chiefeditor',
    EDITOR = 'editor',
    USER = 'user'
}
