import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Filter } from '../models/filter.model';
import { MyHttp } from './my-http';
import { SysConfig } from '../models/auth.model';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class SysService extends MyHttp{
  private filterB2bAnnounced = new Subject<Filter>();

  filterB2bAnnounced$ = this.filterB2bAnnounced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  announceB2bFilter(filters:Filter){
    this.filterB2bAnnounced.next(filters);
    return;
  }

  getConfig():Observable<SysConfig|ResponseError>{
    return this.http.get<SysConfig|ResponseError>(this.sys_config.backend_cmm+'/config/',{
      headers:this.getHeader()
    });
  }

  // list(opt:Options):Observable<TablePrice[]|RequestResponse|ResponseError>{
  //   return this.http.get<TablePrice[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/price-table/',{
  //     headers: this.getHeader(),
  //     params: this.getParams(opt)
  //   });
  // }
}
