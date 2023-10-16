import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductStock, Product } from 'src/app/models/product.model';
import { MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http);
  }

  list(options:Options):Observable<RequestResponse|ResponseError>{
    // let httpParams = new HttpParams()
    // if (options.page!=null){
    //   httpParams = httpParams.set("page",String(options.page));
    // }
    // if (options.pagSize!=null){
    //   httpParams = httpParams.set("pageSize",String(options.pagSize));
    // }
    // if (options.search!=""){
    //   httpParams = httpParams.set("query",String(options.search));
    // }
    // if (options.orderBy!=null){
    //   httpParams = httpParams.set("order_by",String(options.orderBy))
    //   .set("order_dir",options.orderDir);
    // }
    // if (String(options.brand)!=""){
    //   httpParams = httpParams.set('brand',String(options.brand))
    // }
    // if (String(options.collection)!=""){
    //   httpParams = httpParams.set('collection',String(options.collection));
    // }
    // if (String(options.category)!=""){
    //   httpParams = httpParams.set('category',String(options.category));
    // }
    // if (String(options.model)!=""){
    //   httpParams = httpParams.set('model',String(options.model));
    // }
    // if (String(options.type)!=""){
    //   httpParams = httpParams.set('type',String(options.type));
    // }
    // if (String(options.color)!=""){
    //   httpParams = httpParams.set('color',String(options.color));
    // }
    // if (String(options.size)!=""){
    //   httpParams = httpParams.set('size',String(options.size));
    // }
    // if (String(options.search!="")){
    //   httpParams = httpParams.set('query',String(options.search));
    // }

    return this.http.get<RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products/gallery/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }
  
  get_stock(id_product:number):Observable<ProductStock[]>{
    return this.http.get<ProductStock[]>(this.sys_config.backend_b2b+'/product-stock/load-by-product/'+id_product,{
      headers: this.getHeader()
    });
  }

  get(id_product:number):Observable<Product>{
    return this.http.get<Product>(this.sys_config.backend_cmm+'/products/'+id_product.toString(),{
      headers:this.getHeader()
    });
  }
}
