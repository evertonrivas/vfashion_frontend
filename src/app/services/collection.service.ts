import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { ProductCollection } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http)
  }

  list(opt:Options):Observable<ProductCollection[]|RequestResponse|ResponseError>{
    return this.http.get<ProductCollection[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/collection/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<ProductCollection|ResponseError>{
    return this.http.get<ProductCollection|ResponseError>(this.sys_config.backend_b2b+'/collection/'+id.toString(),{
      headers:this.getHeader()
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_b2b+'/collection/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    })
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b+"/collection/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
