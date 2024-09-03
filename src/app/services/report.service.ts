import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { FilePdf, F2bReport } from '../models/system.enum';

@Injectable({
  providedIn: 'root'
})
export class ReportService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  list(opt:Options):Observable<F2bReport[]|RequestResponse|ResponseError>{
    return this.http.get<F2bReport[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/reports/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  load(id:number):Observable<F2bReport|ResponseError>{
    return this.http.get<F2bReport|ResponseError>(this.sys_config.backend_cmm+'/reports/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  open(_report:number,_params:any[]):Observable<FilePdf|ResponseError>{
    return this.http.post<FilePdf|ResponseError>(this.sys_config.backend_cmm+'/reports/',{
      "report": _report,
      "params": _params
    },{
      headers: this.getHeader(ContentType.json)
    });
  }
}
