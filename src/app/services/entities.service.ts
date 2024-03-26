import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerGroup, Entity, EntityContact, EntityWeb } from '../models/entity.model';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class EntitiesService extends MyHttp {

  constructor(http:HttpClient) { 
    super(http);
  }

  loadEntity(id:number|null):Observable<Entity|ResponseError>{
    var url = this.sys_config.backend_cmm+'/legal-entities/'+(id!=null?id:localStorage.getItem('id_user'));
    return this.http.get<Entity|ResponseError>(url,{
      headers:this.getHeader()
    });
  }

  deleteEntity(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/legal-entities/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  //realiza insert e update de um entity
  saveEntity(entity:Entity):Observable<number|boolean|ResponseError>{
    var url = this.sys_config.backend_cmm+'/legal-entities/'+(entity.id>0?entity.id.toString():'');
    return this.http.post<number|boolean|ResponseError>(url,{
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

  saveContacts(contacts:EntityContact[]):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-contacts';
    return this.http.post<boolean|ResponseError>(url,JSON.stringify(contacts),{
      headers:this.getHeader(ContentType.json)
    });
  }

  deleteContacts(contacts:EntityContact[]):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-contacts';
    return this.http.delete<boolean|ResponseError>(url,{
      headers: this.getHeader(ContentType.json),
      body:JSON.stringify(contacts)
    });
  }

  saveWebs(webs:EntityWeb[]):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-webs';
    return this.http.post<boolean|ResponseError>(url,JSON.stringify(webs),{
      headers:this.getHeader(ContentType.json)
    });
  }

  deleteWebs(webs:EntityWeb[]):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/save-webs';
    return this.http.delete<boolean|ResponseError>(url,{
      headers: this.getHeader(ContentType.json),
      body: JSON.stringify(webs)
    });
  }

  deleteFile(id:number):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/upload/'+id.toString();
    return this.http.delete<boolean>(url,{
      headers: this.getHeader(ContentType.json)
    });
  }

  loadHistory(idCustomer:number,opt:Options):Observable<Entity[]|RequestResponse|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/load-history/'+idCustomer.toString();
    return this.http.get<Entity[]|RequestResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  listEntity(opt:Options):Observable<Entity[]|RequestResponse|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/';
    return this.http.get<Entity[]|RequestResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  listCustomerGroup(opt:Options):Observable<CustomerGroup|RequestResponse|ResponseError>{
    return this.http.get<CustomerGroup|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/customer-group/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadCustomerGroup(id:number):Observable<CustomerGroup|ResponseError>{
    return this.http.get<CustomerGroup|ResponseError>(this.sys_config.backend_b2b+'/customer-group/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  saveCustomerGroup(data:any):Observable<boolean|number|ResponseError>{
    return this.http.post<boolean|number|ResponseError>(this.sys_config.backend_b2b+'/customer-group/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  deleteCustomerGroup(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b+"/customer-group/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
