import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';
import { User } from '../models/user.model';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entity } from '../models/entity.model';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends MyHttp {
  constructor(http:HttpClient) {
    super(http);
  }

  profileGet():Observable<Profile|ResponseError>{
    var url = this.sys_config.backend_cmm+"/legal-entities/"+localStorage.getItem("id_user");
    return this.http.get<Profile|ResponseError>(url,{
      headers: this.getHeader()});
  }

  profileSave(profile:Profile):Observable<boolean|number|ResponseError>{
    var frmData = new FormData();
    frmData.append("name",profile.name);
    frmData.append("instagram",profile.instagram);
    frmData.append("taxvat", profile.taxvat);
    frmData.append("state_region",profile.state_region);
    frmData.append("city",profile.city);
    frmData.append("postal_code",profile.postal_code);
    frmData.append("neighborhood",profile.neighborhood);
    frmData.append("phone",profile.phone);
    frmData.append("email",profile.email);
    
    return this.http.post<boolean|number|ResponseError>(this.sys_config.backend_cmm+"/legal-entities/"+profile.id,frmData,{
      headers:this.getHeader(ContentType.json)
    });
  }

  profileList(options:Options):Observable<Profile[]|RequestResponse|ResponseError>{
    let params:HttpParams = new HttpParams().set("page",options.page);
    var url = this.sys_config.backend_cmm+"/legal-entities/";
    return this.http.get<Profile[]|RequestResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page)
        .set("pageSize",options.pageSize.toString())
        .set("query",options.query)
    });
  }

  profileMassive(entities:Entity[]):Observable<boolean|ResponseError>{
    var url = this.sys_config.backend_cmm+"/legal=entities/massive-change";
    return this.http.post<boolean|ResponseError>(url,entities,{
      headers:this.getHeader(ContentType.json)
    });
  }
}
