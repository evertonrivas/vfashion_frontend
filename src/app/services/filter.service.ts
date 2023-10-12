import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductCategory, ProductCollection, B2bBrand, ProductType, ProductModel, Size, Color } from 'src/app/models/product.model';
import { Filter } from '../models/filter.model';
import { MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService extends MyHttp{
  private filterAnnouced = new Subject<Filter>();

  filterAnnouced$ = this.filterAnnouced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  announceFilter(filters:Filter){
    this.filterAnnouced.next(filters);
  }

  listBrand(opt:Options):Observable<B2bBrand[]|RequestResponse|ResponseError>{ 
    return this.http.get<B2bBrand[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/brand/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listCollection(opt:Options):Observable<ProductCollection[]|RequestResponse|ResponseError>{
    return this.http.get<ProductCollection[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/collection/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listCategory(opt:Options):Observable<ProductCategory[]|RequestResponse|ResponseError>{
    return this.http.get<ProductCategory[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-category/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listType(opt:Options):Observable<ProductType[]|RequestResponse|ResponseError>{
    return this.http.get<ProductType[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-type/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listModel(opt:Options):Observable<ProductModel[]|RequestResponse|ResponseError>{
    return this.http.get<ProductModel[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products-model/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listSize(opt:Options):Observable<Size[]|RequestResponse|ResponseError>{
    return this.http.get<Size[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/translate-sizes/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  listColor(opt:Options):Observable<Color[]|RequestResponse|ResponseError>{
    return this.http.get<Color[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/translate-colors/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
