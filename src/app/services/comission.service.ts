import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseError } from '../models/paginate.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComissionService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http)
  }

  loadTarget(year:number):Observable<any|ResponseError>{
    return this.http.get<any|ResponseError>(this.sys_config.backend_b2b+'/target/'+year.toString(),{
      headers: this.getHeader()
    });
  }

  loadComission(year:number):Observable<any|ResponseError>{
    return this.http.get<any|ResponseError>(this.sys_config.backend_b2b+'/comission/'+year.toString(),{
      headers: this.getHeader()
    });
  }

  saveTarget(year:number,values:any):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_b2b+'/target/'+year.toString(),JSON.stringify(values),{
      headers: this.getHeader(ContentType.json)
    });
  }

  saveComission(year:number,values:any):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_b2b+'/comission/'+year.toString(),JSON.stringify(values),{
      headers: this.getHeader(ContentType.json)
    });
  }
}
