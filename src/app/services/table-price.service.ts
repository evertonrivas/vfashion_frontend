import { Injectable } from '@angular/core';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Observable } from 'rxjs';
import { MyHttp } from './my-http';
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
    return this.http.get<TablePrice[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/table-price/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page)
        .set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }
}
