import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ContentType, MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  send(to:string[],subject:string,content:string,attachments:string[]):Observable<boolean>{
    return this.http.post<boolean>(this.sys_config.backend_cmm+'/email',{
      to: JSON.stringify(to),
      subject:subject,
      content:content,
      attachments: JSON.stringify(attachments)
    },{
      headers: this.getHeader(ContentType.json)
    });
  }
}
