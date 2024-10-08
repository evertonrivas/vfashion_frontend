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
    var url = this.sys_config.backend_cmm+'/legal-entities/'+(entity.id > 0 ?entity.id.toString():'');
    return this.http.post<number|boolean|ResponseError>(url,JSON.stringify(entity),{
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

  deleteFile(id:number):Observable<boolean|ResponseError>{
    let url = this.sys_config.backend_cmm+'/upload/'+id.toString();
    return this.http.delete<boolean>(url,{
      headers: this.getHeader(ContentType.json)
    });
  }

  loadHistory(idCustomer:number,opt:Options):Observable<Entity[]|RequestResponse|ResponseError>{
    let url = this.sys_config.backend_cmm+'/legal-entities/history/'+idCustomer.toString();
    return this.http.get<Entity[]|RequestResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  saveHistory(idCustomer:number,text:string):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/history/'+idCustomer.toString(),
    JSON.stringify(text),{
      headers: this.getHeader(ContentType.json)
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

  addToCustomerGroup(id:number,data:any):Observable<boolean|ResponseError>{
    return this.http.put<boolean|ResponseError>(this.sys_config.backend_b2b+'/customer-group/'+id.toString(),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  listCustomerGroupCustomers(opt:Options):Observable<CustomerGroup|RequestResponse|ResponseError>{
    return this.http.get<CustomerGroup|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/customer-group/customers/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }
  
  processImport():Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_cmm+'/legal-entities/process-import/',{},{
      headers: this.getHeader()
    });
  }
}
