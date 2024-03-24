import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { B2bBrand } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http)
  }

  list(opt:Options):Observable<B2bBrand[]|RequestResponse|ResponseError>{ 
    return this.http.get<B2bBrand[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/brand/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<B2bBrand|ResponseError>{
    return this.http.get<B2bBrand|ResponseError>(this.sys_config.backend_b2b+'/brand/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_b2b+'/brand/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[]):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b,{
      headers: this.getHeader(ContentType.json),
      body: ids
    });
  }
}
