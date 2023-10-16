import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityType } from '../models/entity.model';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends MyHttp{
  constructor(http:HttpClient) {
    super(http);
   }

   calendarCountEntity(type:EntityType):Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/count',{
      headers: this.getHeader(),
      params: new HttpParams().set("type",type.toString())
    });
   }

   calendarCountOrder():Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_b2b+'/orders/total',{
      headers: this.getHeader()
    });
   }

   calendarValueOrder():Observable<number|ResponseError>{
    return this.http.post<number|ResponseError>(this.sys_config.backend_b2b+'/orders/total',{
      headers: this.getHeader()
    });
   }

   calendarValueOrderByRepresentative():Observable<any>{
    return this.http.get<any>(this.sys_config.backend_b2b+'',{
      headers: this.getHeader()
    });
   }

}
