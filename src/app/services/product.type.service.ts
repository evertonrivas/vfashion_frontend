import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { ProductType } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductTypeService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http)
  }

  list(opt:Options):Observable<ProductType[]|RequestResponse|ResponseError>{
    return this.http.get<ProductType[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-type/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<ProductType|ResponseError>{
    return this.http.get<ProductType|ResponseError>(this.sys_config.backend_cmm+'/products-type/'+id.toString(),{
      headers: this.getHeader()
    });
  }
  
  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products-type/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/products-type/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
