import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funnel } from '../models/crm.model';
import { Entity, EntityHistory } from '../models/entity.model';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class CrmService  extends MyHttp{

  constructor(http:HttpClient) {
    super(http);
  }

  getFunnels(opt:Options):Observable<Funnel[]|RequestResponse|ResponseError>{
    return this.http.get<Funnel[]|RequestResponse|ResponseError>(this.sys_config.backend_crm+'/funnels/',
    {
      headers:this.getHeader(),
      params: new HttpParams().set("query",opt.query as string)
    });
  }

  getCustomersOfStage(idStage:number,opts:Options):Observable<Entity[]|RequestResponse|ResponseError>{
    return this.http.get<Entity[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/by-crm-stage/'+idStage.toString(),{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opts.page).set("query",opts.query as string)
    });
  }

  getRepresentatives(opts:Options):Observable<Entity[]>{
    return this.http.get<Entity[]>(this.sys_config.backend_cmm+'/legal-entities/',{
      headers: this.getHeader(ContentType.json),
      params: new HttpParams().set("query",opts.query as string)
    });
  }

  moveCustomerToStage(idCustomer:number,idStage:number):Observable<number|boolean|ResponseError>{
    //console.log("Realizando movimentacao");
    return this.http.get<number|boolean|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      headers: this.getHeader(),
      params: new HttpParams().set("id_customer",idCustomer).set("id_stage",idStage)
    });
  }

  moveCustomersToState(customers:number[],idStage:number):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      customers: JSON.stringify(customers),
      stage: idStage.toString()
    },{
      headers: this.getHeader(ContentType.json)
    });
  }

  removeCustomers(customers:number[]):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/move-customer',{
      headers: this.getHeader(ContentType.json),
      body: {
        customers: customers
      }
    });
  }
}
