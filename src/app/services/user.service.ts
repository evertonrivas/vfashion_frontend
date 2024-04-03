import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  load(id:number):Observable<User|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/"+id.toString();
    return this.http.get<User|ResponseError>(url,{
      headers: this.getHeader()
    });
  }

  list(options:Options):Observable<User[]|RequestResponse|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.get<User[]|RequestResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: this.getParams(options)
    });
  }

  save(users:User[]):Observable<boolean|number|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.post<boolean>(url,users,{
      headers:this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/users/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  userUpdate(user:User):Observable<boolean|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/"+user.id?.toString();
    let frmData = new FormData();
    frmData.set("username",user.username);
    frmData.set("password",String(user.password));
    frmData.set("active",String(user.active));
    frmData.set("type",user.type);
    return this.http.post<boolean>(url,frmData,{
      headers:this.getHeader(ContentType.json)
    });
  }

  userMassive(ids:number[],pwd:string,rule:string,user_type:string):Observable<boolean|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/massive-change";
    return this.http.post<boolean>(url,{
      ids: ids,
      password: pwd,
      rule: rule,
      type: user_type
    },{
      headers:this.getHeader(ContentType.json)
    });
  }

  resetPassword(id:number):Observable<string|ResponseError>{
    return this.http.get<string|ResponseError>(this.sys_config.backend+'/users/set-new-password/'+id.toString(),{
      headers:this.getHeader()
    });
  }
}
