import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http);
  }

  listGallery(options:Options):Observable<Product[]|RequestResponse|ResponseError>{
    return this.http.get<Product[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products/gallery/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }
  
  get_stock(id_product:number):Observable<Product[]>{
    return this.http.get<Product[]>(this.sys_config.backend_b2b+'/product-stock/load-by-product/'+id_product,{
      headers: this.getHeader()
    });
  }

  get(id_product:number):Observable<Product>{
    return this.http.get<Product>(this.sys_config.backend_cmm+'/products/'+id_product.toString(),{
      headers:this.getHeader()
    });
  }
}
