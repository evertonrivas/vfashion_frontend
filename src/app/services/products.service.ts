import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http);
  }

  get(id_product:number):Observable<Product|ResponseError>{
    return this.http.get<Product|ResponseError>(this.sys_config.backend_cmm+'/products/'+id_product.toString(),{
      headers:this.getHeader()
    });
  }
}
