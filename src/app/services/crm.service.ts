import { Injectable } from '@angular/core';
import { ContentType, MyHttp, RequestOptions } from './my-http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funnel, FunnelOptions } from '../models/crm.model';
import { Entity, EntityHistory, EntityResponse } from '../models/entity.model';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class CrmService  extends MyHttp{

  constructor(http:HttpClient) {
    super(http);
  }

  getFunnels(opt:FunnelOptions):Observable<Funnel[]|ResponseError>{
    return this.http.get<Funnel[]|ResponseError>(this.sys_config.backend_crm+'/funnels/',
    {
      headers:this.getHeader(),
      params: new HttpParams().set("query",opt.query as string)
    });
  }

  getCustomersOfStage(idStage:number,opts:RequestOptions):Observable<EntityResponse>{
    return this.http.get<EntityResponse>(this.sys_config.backend_cmm+'/legal-entities/by-crm-stage/'+idStage.toString(),{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opts.page).set("query",opts.query as string)
    });
  }

  getRepresentatives(opts:RequestOptions):Observable<Entity[]>{
    return this.http.get<Entity[]>(this.sys_config.backend_cmm+'/legal-entities/',{
      headers: this.getHeader(ContentType.json),
      params: new HttpParams().set("query",opts.query as string)
    });
  }

  moveCustomerToStage(idCustomer:number,idStage:number):Observable<any>{
    //console.log("Realizando movimentacao");
    return this.http.get<any>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      headers: this.getHeader(),
      params: new HttpParams().set("id_customer",idCustomer).set("id_stage",idStage)
    });
  }

  moveCustomersToState(customers:number[],idStage:number):Observable<boolean>{
    return this.http.post<boolean>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      customers: JSON.stringify(customers),
      stage: idStage.toString()
    },{
      headers: this.getHeader(ContentType.json)
    });
  }

  removeCustomers(customers:number[]):Observable<boolean>{
    return this.http.delete<boolean>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      headers: this.getHeader(ContentType.json),
      body: {
        customers: customers
      }
    });
  }
}
