import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ResponseError } from '../models/paginate.model';
import { AccessLevel, EntityType } from '../models/system.enum';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService extends MyHttp{
  private counterAnnounced = new Subject<any>();
  counterAnnounced$ = this.counterAnnounced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  annunceCounter():void{
    this.counterAnnounced.next(null);  
  }

  b2bTotalCart(userType:string):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_b2b+'/cart/total/',{
      headers: this.getHeader(),
      params: new HttpParams().set('userType',userType)
    });
  }

  b2bTotalDevolution(userType:string):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_fpr+'/devolution/indicator/',{
      headers: this.getHeader(),
      params: new HttpParams().set('userType',userType)
    })
  }

  //realiza a contagem total de entidades do calendario
  calendarCountEntity(type:EntityType):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/count',{
      headers: this.getHeader(),
      params: new HttpParams().set("type",type.toString())
    });
   }

   //realiza a contagem total de pedidos do calendario
   calendarCountOrder():Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_b2b+'/orders/total/',{
      headers: this.getHeader()
    });
   }

   //realiza a soma total dos valores de pedidos do calendario
   calendarValueOrder():Observable<number|ResponseError>{
    return this.http.post<number|ResponseError>(this.sys_config.backend_b2b+'/orders/total/',null,{
      headers: this.getHeader()
    });
   }

   //realiza a soma total dos pedidos por representante no calendario
   calendarValueOrderByRepresentative():Observable<any>{
    return this.http.put<any>(this.sys_config.backend_b2b+'/orders/total/',{
      headers: this.getHeader()
    });
   }

   licenseCount(level:AccessLevel = AccessLevel.NONE):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_cmm+'/users/count',{
      headers: this.getHeader(),
      params: new HttpParams().set("level",level.toString())
    });
   }

   reprTotalCustomer(p_id:number):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_b2b+'/customer-group/representative-indicator/'+p_id.toString(),{
      headers:this.getHeader()
    });
   }

   reprTotalOrder(p_id:number):Observable<number|ResponseError>{
    return this.http.post<number|ResponseError>(this.sys_config.backend_b2b+'/customer-group/representative-indicator/'+p_id.toString(),{},{
      headers: this.getHeader()
    });
   }

   reprCountOrder(p_id:number):Observable<number|ResponseError>{
    return this.http.put<number|ResponseError>(this.sys_config.backend_b2b+'/customer-group/representative-indicator/'+p_id.toString(),{},{
      headers: this.getHeader()
    });
   }

   reprGoal(p_id:number):Observable<number|ResponseError>{
    return this.http.patch<number|ResponseError>(this.sys_config.backend_b2b+'/customer-group/representative-indicator/'+p_id.toString(),{},{
      headers: this.getHeader()
    });
   }
  
}
