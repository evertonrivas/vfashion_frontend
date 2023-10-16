import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, StageRegion,City } from '../models/place.model';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService extends MyHttp{

  constructor(http:HttpClient) { 
    super(http);
  }

  listCountries(opts:Options):Observable<Country[]|RequestResponse|ResponseError>{
    return this.http.get<Country[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/countries/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opts.page).set("pageSize",opts.pageSize).set("query",opts.query)
    });
  }

  listStageRegions(opts:Options):Observable<StageRegion[]|RequestResponse|ResponseError>{
    return this.http.get<StageRegion[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/state-regions/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opts.page).set("pageSize",opts.pageSize).set("query",opts.query)
    });
  }

  listCities(opts:Options):Observable<City[]|RequestResponse|ResponseError>{
    return this.http.get<City[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/cities/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opts.page).set("pageSize",opts.pageSize).set("query",opts.query)
    });
  }
}
