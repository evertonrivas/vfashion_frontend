import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  send(to:string[],subject:string,content:string,attachments:string[]):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_cmm+'/email/',{
      to: to,
      subject:subject,
      content:content,
      attachments: attachments
    },{
      headers: this.getHeader(ContentType.json)
    });
  }
}
