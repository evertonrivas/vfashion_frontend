import { Injectable } from '@angular/core';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Observable } from 'rxjs';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TablePrice } from '../models/table-price.model';

@Injectable({
  providedIn: 'root'
})
export class TablePriceService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<TablePrice[]|RequestResponse|ResponseError>{
    return this.http.get<TablePrice[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/price-table/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<TablePrice|ResponseError>{
    return this.http.get<TablePrice|ResponseError>(this.sys_config.backend_b2b+'/price-table/'+id.toString(),{
      headers: this.getHeader()
    });
  }
  
  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_b2b+'/price-table/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b+"/price-table/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
