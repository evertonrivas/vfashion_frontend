import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
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
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
