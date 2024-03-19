import { Injectable } from '@angular/core';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductCategory } from '../models/product.model';
import { MyHttp } from './my-http';

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
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
