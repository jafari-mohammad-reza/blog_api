import {Expose} from "class-transformer";

export default class UserDto{
    @Expose()
    id:number;
    @Expose()
    username:string;
    @Expose()
    email:string;
}
