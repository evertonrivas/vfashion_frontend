import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Filter } from '../models/filter.model';
import { MyHttp } from './my-http';

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
}
