import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Size } from '../models/product.model';
import { PaymentCondition } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentConditionService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<PaymentCondition[]|RequestResponse|ResponseError>{
    return this.http.get<PaymentCondition[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/payment-conditions/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<PaymentCondition|ResponseError>{
    return this.http.get<PaymentCondition|ResponseError>(this.sys_config.backend_b2b+'/payment-conditions/'+id.toString(),{
      headers: this.getHeader()
    });
  }
  
  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_b2b+'/payment-conditions/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }
}
