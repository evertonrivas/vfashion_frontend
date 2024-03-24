import { Injectable } from '@angular/core';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product.model';
import { ContentType, MyHttp } from './my-http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<ProductCategory[]|RequestResponse|ResponseError>{
    return this.http.get<ProductCategory[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-category/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<ProductCategory|ResponseError>{
    return this.http.get<ProductCategory|ResponseError>(this.sys_config.backend_cmm+'/products-category/'+id.toString(),{
      headers:this.getHeader()
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products-category/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }
}
