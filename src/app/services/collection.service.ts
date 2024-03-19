import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
