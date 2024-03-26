import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Size } from '../models/product.model';
import { ContentType, MyHttp } from './my-http';

@Injectable({
  providedIn: 'root'
})
export class SizeService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<Size[]|RequestResponse|ResponseError>{
    return this.http.get<Size[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/translate-sizes/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<Size|ResponseError>{
    return this.http.get<Size|ResponseError>(this.sys_config.backend_cmm+'/translate-sizes/'+id.toString(),{
      headers: this.getHeader()
    });
  }
  
  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/translate-sizes/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/translate-sizes/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
