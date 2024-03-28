import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { ContentType, MyHttp } from './my-http';
import { MeasureUnit } from '../models/measure-unit';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MeasureUnitService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<MeasureUnit[]|RequestResponse|ResponseError>{
    return this.http.get<MeasureUnit[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/measure-unit/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<MeasureUnit|ResponseError>{
    return this.http.get<MeasureUnit|ResponseError>(this.sys_config.backend_cmm+'/measure-unit/'+id.toString(),{
      headers:this.getHeader()
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/measure-unit/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    })
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/measure-unit/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
