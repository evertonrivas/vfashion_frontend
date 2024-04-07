import { Injectable } from '@angular/core';
import { ContentType, MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarModel, CalendarEvent, CalendarEventData, CalendarEventType } from '../models/calendar.model';
import { Observable } from 'rxjs';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { CommercialRule } from '../models/commercial-rule.model';
import { EventType } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CalendarService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  calendarLoad(options:Options):Observable<CalendarModel[]|RequestResponse|ResponseError>{
    return this.http.get<CalendarModel[]|RequestResponse|ResponseError>(this.sys_config.backend_scm+'/calendar/',{
      headers: this.getHeader(),
      params: this.getParams(options)
    });
  }

  calendarEventLoad(options:Options):Observable<CalendarEvent[]|RequestResponse|ResponseError>{
    return this.http.get<CalendarEvent[]|RequestResponse|ResponseError>(this.sys_config.backend_scm+'/calendar/events',{
      headers: this.getHeader(),
      params: this.getParams(options)
    })
  }

  calendarEventSave(evt:CalendarEventData):Observable<number|boolean|ResponseError>{
    let data = {
        name: evt.name,
        date_start: evt.date_start,
        date_end: evt.date_end,
        id_event_type: evt.id_event_type,
        id_collection: evt.id_collection,
        budget_value: evt.budget_value,
        id_parent: evt.id_parent
      }
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_scm+'/calendar/'+(evt.id!=0?evt.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  calendarEventDelete(evts:number[]):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_scm+'/calendar/',{
      headers:this.getHeader(ContentType.form),
      body: evts
    });
  }

  saveEventType(event:CalendarEventType):Observable<boolean|ResponseError>{
    let data = {
      id: event.id,
      name: event.name,
      hex_color: event.hex_color,
      has_budget: event.has_budget,
      is_milestone: event.is_milestone,
      use_collection: event.use_collection,
      children: [],
      parent: []
    }

    return this.http.post<boolean|ResponseError>(this.sys_config.backend_scm+'/event-type/'+(event.id!=0?event.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  listEventType(options:Options):Observable<CalendarEventType[]|RequestResponse|ResponseError>{
    let myParams:HttpParams = new HttpParams().set("page",options.page);
    return this.http.get<CalendarEventType[]|RequestResponse|ResponseError>(this.sys_config.backend_scm+'/event-type/',{
      headers: this.getHeader(),
      params: this.getParams(options)
    });
  }

  loadEventType(id:number):Observable<CalendarEventType|ResponseError>{
    return this.http.get<CalendarEventType|ResponseError>(this.sys_config.backend_scm+'/event-type/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  deleteEventType(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b+"/brand/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
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
