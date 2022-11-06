import {CallHandler, ExecutionContext, Injectable, NestInterceptor, UseInterceptors} from '@nestjs/common';
import {map, Observable} from 'rxjs';
import {ClassConstructor} from "../interfaces";
import {plainToInstance} from "class-transformer";

export function Serialize(dto : any){
  return UseInterceptors(new SerializationInterceptor(dto))
}
@Injectable()
export class SerializationInterceptor implements NestInterceptor {
  constructor(private dto :ClassConstructor) {
  }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data:any) => {
      return plainToInstance(this.dto , data, {excludeExtraneousValues:true})
    }));
  }
}
