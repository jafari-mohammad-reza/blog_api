export interface BlogInterface{
    id?:string;
    title?:string;
    slug?:string;
    content?:string;
    headerImage?:string;
    created?:Date;
    updated?:Date;
    publishedDate?:Date;
    isPublished?:boolean;
    likes?:number;
    author?:number;
}
