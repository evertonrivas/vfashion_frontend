import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EntityType } from '../models/entity.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends MyHttp{
  constructor(http:HttpClient) {
    super(http);
   }

   calendarCountEntity(type:EntityType):Observable<number>{
    return this.http.get<number>(this.sys_config.backend_cmm+'/legal-entities/count',{
      headers: this.getHeader(),
      params: new HttpParams().set("type",type.toString())
    });
   }

   calendarCountOrder():Observable<number>{
    return this.http.get<number>(this.sys_config.backend_b2b+'/orders/total',{
      headers: this.getHeader()
    });
   }

   calendarValueOrder():Observable<number>{
    return this.http.post<number>(this.sys_config.backend_b2b+'/orders/total',{
      headers: this.getHeader()
    });
   }

   calendarValueOrderByRepresentative():Observable<any>{
    return this.http.get<any>(this.sys_config.backend_b2b+'',{
      headers: this.getHeader()
    });
   }

}
