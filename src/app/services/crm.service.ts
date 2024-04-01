import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funnel, FunnelStage } from '../models/crm.model';
import { Entity } from '../models/entity.model';
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
      params: this.getParams(opt)
    });
  }

  loadFunnel(id:number):Observable<Funnel|ResponseError>{
    return this.http.get<Funnel|ResponseError>(this.sys_config.backend_crm+'/funnels/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  deleteFunnel(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_crm+"/funnels/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  saveFunnel(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_crm+'/funnels/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    })
  }

  listStages(opt:Options):Observable<FunnelStage[]|RequestResponse|ResponseError>{
    return this.http.get<FunnelStage[]|RequestResponse|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadStage(id:number):Observable<FunnelStage|ResponseError>{
    return this.http.get<FunnelStage|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  deleteStages(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_crm+"/funnel-stages/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  saveStages(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_crm+'/funnel-stages/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    })
  }

  getCustomersOfStage(idStage:number,opts:Options):Observable<Entity[]|RequestResponse|ResponseError>{
    return this.http.get<Entity[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/by-crm-stage/'+idStage.toString(),{
      headers: this.getHeader(),
      params: this.getParams(opts)
    });
  }

  getRepresentatives(opts:Options):Observable<Entity[]>{
    return this.http.get<Entity[]>(this.sys_config.backend_cmm+'/legal-entities/',{
      headers: this.getHeader(ContentType.json),
      params: this.getParams(opts)
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
