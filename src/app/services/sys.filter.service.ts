import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductCategory, ProductCollection, B2bBrand, ProductType, ProductModel, Size, Color } from 'src/app/models/product.model';
import { Filter } from '../models/filter.model';
import { MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';

@Injectable({
  providedIn: 'root'
})
export class SysFilterService extends MyHttp{
  private filterB2bAnnounced = new Subject<Filter>();
  private filterSysAnnounced = new Subject<string>();

  filterB2bAnnounced$ = this.filterB2bAnnounced.asObservable();
  filterSysAnnounced$ = this.filterSysAnnounced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  announceB2bFilter(filters:Filter){
    this.filterB2bAnnounced.next(filters);
  }

  announceSysFilter(data:string){
    this.filterSysAnnounced.next(data);
  }
}
