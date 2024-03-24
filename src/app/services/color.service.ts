import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Color } from '../models/product.model';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<Color[]|RequestResponse|ResponseError>{
    return this.http.get<Color[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/translate-colors/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<Color|ResponseError>{
    return this.http.get<Color|ResponseError>(this.sys_config.backend_cmm+'/translate-colors/'+id.toString(),{
      headers:this.getHeader()
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/translate-colors/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    })
  }
}
