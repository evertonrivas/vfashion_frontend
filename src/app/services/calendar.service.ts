import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarModel, CalendarEvent, CalendarEventData, CalendarEventType, EventTypeOptions } from '../models/calendar.model';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { CommercialRule } from '../models/commercial-rule.model';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  calendarLoad(options:Options):Observable<CalendarModel[]>{
    return this.http.get<CalendarModel[]>(this.sys_config.backend_scm+'/calendar/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }

  calendarEventLoad(options:Options):Observable<CalendarEvent[]>{
    return this.http.get<CalendarEvent[]>(this.sys_config.backend_scm+'/calendar/events',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    })
  }

  calendarEventSave(evt:CalendarEventData):Observable<any>{
    let data = {
        name: evt.name,
        date_start: evt.date_start,
        date_end: evt.date_end,
        id_event_type: evt.id_event_type,
        id_collection: evt.id_collection,
        budget_value: evt.budget_value,
        id_parent: evt.id_parent
      }
    return this.http.post<any>(this.sys_config.backend_scm+'/calendar/'+(evt.id!=0?evt.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  calendarEventDelete(evts:number[]):Observable<boolean>{
    return this.http.delete<boolean>(this.sys_config.backend_scm+'/calendar/',{
      headers:this.getHeader(ContentType.form),
      body: evts
    });
  }

  eventTypeSave(event:CalendarEventType):Observable<boolean>{
    let data = {
      name: event.name,
      hex_color: event.hex_color,
      has_budget: event.has_budget
    }

    return this.http.post<boolean>(this.sys_config.backend_scm+'/event-type/'+(event.id!=0?event.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  eventTypeList(options:Options):Observable<CalendarEventType[]|RequestResponse|ResponseError>{
    let myParams:HttpParams = new HttpParams().set("page",options.page);
    return this.http.get<CalendarEventType[]|RequestResponse|ResponseError>(this.sys_config.backend_scm+'/event-type/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }

  listFlimv():Observable<CommercialRule[]|ResponseError>{
    return this.http.get<CommercialRule[]|ResponseError>(this.sys_config.backend_scm+'/calendar/flimv',{
      headers: this.getHeader()
    });
  }

  getFlimv(id:number):Observable<CommercialRule|ResponseError>{
    return this.http.get<CommercialRule|ResponseError>(this.sys_config.backend_scm+'/calendar/flimv/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  saveFlimv(data:CommercialRule[]):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_scm+'/calendar/flimv',{
      "rules": data
    },{
      headers: this.getHeader(ContentType.json)
    });
  }

}
