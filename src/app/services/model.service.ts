import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { ProductModel } from '../models/product.model';
import { MyHttp } from './my-http';

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
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
