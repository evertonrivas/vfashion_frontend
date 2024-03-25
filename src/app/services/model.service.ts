import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { ProductModel } from '../models/product.model';
import { ContentType, MyHttp } from './my-http';

@Injectable({
  providedIn: 'root'
})
export class ModelService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<ProductModel[]|RequestResponse|ResponseError>{
    return this.http.get<ProductModel[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-model/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<ProductModel|ResponseError>{
    return this.http.get<ProductModel|ResponseError>(this.sys_config.backend_cmm+'/products-model/'+id.toString(),{
      headers: this.getHeader()
    });
  }
  
  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products-model/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }
}
