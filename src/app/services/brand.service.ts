import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
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
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
