import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ProductCategory, ProductCollection, B2bBrand, ProductType, ProductModel, Size, Color } from 'src/app/models/product.model';
import { Filter } from '../models/filter.model';
import { MyHttp } from './my-http';

@Injectable({
  providedIn: 'root'
})
export class FilterService extends MyHttp{
  private filterAnnouced = new Subject<Filter>();

  filterAnnouced$ = this.filterAnnouced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  announceFilter(filters:Filter){
    this.filterAnnouced.next(filters);
  }

  listBrand():Observable<B2bBrand[]>{ 
    return this.http.get<B2bBrand[]>(this.sys_config.backend_b2b+'/brand/',{
      params: this.getListAll(false,"name"),
      headers: this.getHeader()
    });
  }

  listCollection():Observable<ProductCollection[]>{
    return this.http.get<ProductCollection[]>(this.sys_config.backend_b2b+'/collection/',{
      params: this.getListAll(),
      headers: this.getHeader()
    });
  }

  listCategory(){
    return this.http.get<ProductCategory[]>(this.sys_config.backend_cmm+'/products-category/',{
      params: this.getListAll(false,"name"),
      headers: this.getHeader()
    });
  }

  listType():Observable<ProductType[]>{
    return this.http.get<ProductType[]>(this.sys_config.backend_cmm+'/products-type/',{
      params: this.getListAll(false,"name"),
      headers: this.getHeader()
    });
  }

  listModel():Observable<ProductModel[]>{
    return this.http.get<ProductModel[]>(this.sys_config.backend_cmm+'/products-model/',{
      params: this.getListAll(false,"name"),
      headers: this.getHeader()
    });
  }

  listSize(){
    return this.http.get<Size[]>(this.sys_config.backend_cmm+'/translate-sizes/',{
      params: this.getListAll(),
      headers: this.getHeader()
    });
  }

  listColor(){
    return this.http.get<Color[]>(this.sys_config.backend_cmm+'/translate-colors/',{
      params: this.getListAll(false,"name"),
      headers: this.getHeader()
    });
  }
}
