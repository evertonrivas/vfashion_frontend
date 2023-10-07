import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity, EntityContact, EntityWeb, HistoryResponse } from '../models/entity.model';
import { Options, RequestResponse } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService extends MyHttp {

  constructor(http:HttpClient) { 
    super(http);
  }

  loadEntity(id:number|null):Observable<Entity>{
    var url = this.sys_config.backend_cmm+'/legal-entities/'+(id!=null?id:localStorage.getItem('id_user'));
    return this.http.get<Entity>(url,{
      headers:this.getHeader()
    });
  }

  //realiza insert e update de um entity
  saveEntity(entity:Entity):Observable<number>{
    var url = this.sys_config.backend_cmm+'/legal-entities/'+(entity.id>0?entity.id.toString():'');
    return this.http.post<number>(url,{
      "id": entity.id,
      "name": entity.name,
      "fantasy_name":entity.fantasy_name,
      "taxvat": entity.taxvat,
      "id_city": entity.city.id,
      "address": entity.address,
      "postal_code": entity.postal_code,
      "neighborhood": entity.neighborhood,
      "type": entity.type,
      "representative_id": (entity.agent as Entity).id
    },{
      headers:this.getHeader(ContentType.json)
    });
  }

  saveContacts(contacts:EntityContact[]):Observable<boolean>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-contacts';
    return this.http.post<boolean>(url,JSON.stringify(contacts),{
      headers:this.getHeader(ContentType.json)
    });
  }

  deleteContacts(contacts:EntityContact[]):Observable<boolean>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-contacts';
    return this.http.delete<boolean>(url,{
      headers: this.getHeader(ContentType.json),
      body:JSON.stringify(contacts)
    });
  }

  saveWebs(webs:EntityWeb[]):Observable<boolean>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-webs';
    return this.http.post<boolean>(url,JSON.stringify(webs),{
      headers:this.getHeader(ContentType.json)
    });
  }

  deleteWebs(webs:EntityWeb[]):Observable<boolean>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-webs';
    return this.http.delete<boolean>(url,{
      headers: this.getHeader(ContentType.json),
      body: JSON.stringify(webs)
    });
  }

  deleteFile(id:number):Observable<boolean>{
    let url = this.sys_config.backend_cmm+'/upload/'+id.toString();
    return this.http.delete<boolean>(url,{
      headers: this.getHeader(ContentType.json)
    });
  }

  loadHistory(idCustomer:number,opt:Options):Observable<HistoryResponse>{
    let url = this.sys_config.backend_cmm+'/legal-entities/load-history/'+idCustomer.toString();
    return this.http.get<HistoryResponse>(url,{
      headers: this.getHeader(),
      params: new HttpParams().set('page',opt.page).set("pageSize",opt.pageSize).set('query',opt.query)
    });
  }
}
