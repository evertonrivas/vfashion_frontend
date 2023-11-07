import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService extends MyHttp{
  private counterAnnounced = new Subject<any>();
  counterAnnounced$ = this.counterAnnounced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  annunceCounter():void{
    this.counterAnnounced.next(null);  
  }

  getCartTotal():Observable<number|ResponseError>{
    return this.http.get<number|ResponseError>(this.sys_config.backend_b2b+'/cart/total/'+localStorage.getItem("id_profile"),{
      headers: this.getHeader()
    });
  }

  
}
