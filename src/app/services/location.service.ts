import { Injectable } from '@angular/core';
import { MyHttp, RequestOptions } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, StageRegion,City } from '../models/place.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  listCountries(opts:RequestOptions):Observable<Country[]>{
    let myParams:HttpParams = new HttpParams()
      .set("page",opts.page)
      .set("pageSize",opts.pageSize)
    if(opts.query!=null){
      myParams = myParams.set("query",opts.query);
    }
    return this.http.get<Country[]>(this.sys_config.backend_cmm+'/countries/',{
      headers: this.getHeader(),
      params: myParams
    });
  }

  listStageRegions(opts:RequestOptions):Observable<StageRegion[]>{
    let myParams:HttpParams = new HttpParams()
      .set("page",opts.page)
      .set("pageSize",opts.pageSize)
    if(opts.query!=null){
      myParams = myParams.set("query",opts.query);
    }

    return this.http.get<StageRegion[]>(this.sys_config.backend_cmm+'/state-regions/',{
      headers: this.getHeader(),
      params: myParams
    });
  }

  listCities(opts:RequestOptions):Observable<City[]>{
    let myParams:HttpParams = new HttpParams()
      .set("page",opts.page)
      .set("pageSize",opts.pageSize)
    if(opts.query!=null){
      myParams = myParams.set("query",opts.query as string);
    }
    return this.http.get<City[]>(this.sys_config.backend_cmm+'/cities/',{
      headers: this.getHeader(),
      params: myParams
    });
  }
}
