import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { User, UserResponse } from '../models/user.model';
import { Observable } from 'rxjs';
import { Options, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class UserService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  userGet(id:number):Observable<User|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/"+id.toString();
    return this.http.get<User|ResponseError>(url,{
      headers: this.getHeader()
    });
  }

  userList(options:Options):Observable<User[]|UserResponse|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.get<User[]|UserResponse|ResponseError>(url,{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }

  userSave(users:User[]):Observable<boolean|number|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/";
    return this.http.post<boolean>(url,users,{
      headers:this.getHeader(ContentType.json)
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

  userMassive(users:User[]):Observable<boolean|ResponseError>{
    var url = this.sys_config.backend_cmm+"/users/massive-change";
    return this.http.post<boolean>(url,users,{
      headers:this.getHeader(ContentType.json)
    });
  }
}
