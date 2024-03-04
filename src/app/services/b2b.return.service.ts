import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Reason } from '../models/reason.model';

@Injectable({
  providedIn: 'root'
})
export class B2bReturnService  extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  listReasons(opt:Options):Observable<RequestResponse|Reason[]|ResponseError>{
    return this.http.get<RequestResponse|Reason[]|ResponseError>(this.sys_config.backend_fpr+'/reasons/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page).set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  saveReturn(p_id_order:number,p_id_product:[number]):Observable<Boolean|ResponseError>{
    return this.http.post<Boolean|ResponseError>(this.sys_config.backend_fpr+'/return/',{
      "id_order": p_id_order,
      "id_products": p_id_product
    },{
      headers: this.getHeader()
    });
  }

  getReturn(p_id_order:number):Observable<Order|ResponseError>{
    return this.http.get<Order|ResponseError>(this.sys_config.backend_fpr+'/returns/'+p_id_order.toString(),{
      headers: this.getHeader()
    });
  }
}
