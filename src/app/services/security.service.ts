import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContentType, MyHttp } from './my-http';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http)
  }

  tryAuth(_username:string,_password:string): Observable<any>{
    var frmData = new FormData();
    frmData.append("username",_username);
    frmData.append("password",_password);
    return this.http.post<any>(this.sys_config.backend_cmm+"/users/auth",frmData);
  }

  checkLogged():Observable<boolean|ResponseError>{
    return this.http.put<boolean|ResponseError>(this.sys_config.backend_cmm+"/users/auth",{
      "token": localStorage.getItem('token_access')
    },{
      headers: this.getHeader(ContentType.json)
    });
  }

  renewSession():Observable<any>{
    return this.http.get<any>(this.sys_config.backend_cmm+'/users/auth',{
      headers: this.getHeader(),
      params: new HttpParams().set("id",localStorage.getItem("id_user") as string)
    });
  }

  logoff():Observable<any>{
    return this.http.post<any>(this.sys_config.backend_cmm+"/users/logout/"+localStorage.getItem("id_user"),{},{
      headers: this.getHeader()
    });
  }

  recoveryPassword(p_email:string):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_cmm+'/users/password/',{
      "email": p_email
    },{
      headers: this.getHeader(ContentType.json)
    });
  }
}
