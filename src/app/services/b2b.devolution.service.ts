import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model';
import { Devolution, Reason, Step } from '../models/devolution.model';
import { DevolutionStatus } from '../models/system.enum';

@Injectable({
  providedIn: 'root'
})
export class B2bDevolutionService  extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  listReasons(opt:Options):Observable<RequestResponse|Reason[]|ResponseError>{
    return this.http.get<RequestResponse|Reason[]|ResponseError>(this.sys_config.backend_fpr+'/reasons/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadReason(id:number):Observable<Reason|ResponseError>{
    return this.http.get<Reason|ResponseError>(this.sys_config.backend_fpr+'/reasons/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  saveReason(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_fpr+'/reasons/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  deleteReason(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_fpr+"/reasons/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  saveDevolution(p_devolution:Devolution):Observable<Boolean|ResponseError>{
    return this.http.post<Boolean|ResponseError>(this.sys_config.backend_fpr+'/devolution/'+(p_devolution.id > 0?p_devolution.id:''),
      JSON.stringify(p_devolution),{
      headers: this.getHeader(ContentType.json)
    });
  }

  getDevolution(p_id_order:number):Observable<Devolution|ResponseError>{
    return this.http.get<Devolution|ResponseError>(this.sys_config.backend_fpr+'/devolution/'+p_id_order.toString(),{
      headers: this.getHeader()
    });
  }

  deleteDevolution(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_fpr+"/devolution/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  finishDevolution(p_id:number):Observable<boolean|ResponseError>{
    return this.http.put<boolean|ResponseError>(this.sys_config.backend_fpr+"/devolution/"+p_id.toString(),{},{
      headers: this.getHeader()
    });
  }

  listDevolution(opt:Options):Observable<Devolution[]|RequestResponse|ResponseError>{
    return this.http.get<Devolution[]|RequestResponse|ResponseError>(this.sys_config.backend_fpr+"/devolution/",{
      headers: this.getHeader(),
      params:this.getParams(opt)
    });
  }

  listSteps(opt:Options):Observable<RequestResponse|Step[]|ResponseError>{
    return this.http.get<RequestResponse|Step[]|ResponseError>(this.sys_config.backend_fpr+'/steps/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadStep(id:number):Observable<Step|ResponseError>{
    return this.http.get<Step|ResponseError>(this.sys_config.backend_fpr+'/steps/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  saveStep(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_fpr+'/steps/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  deleteSteps(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_fpr+"/steps/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }
}
