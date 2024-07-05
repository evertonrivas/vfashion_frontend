import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductGrid, ProductGridDistribution } from 'src/app/models/product.model';
import { ContentType, MyHttp } from './my-http';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService extends MyHttp{
  constructor(http:HttpClient) { 
    super(http);
  }

  load(id_product:number):Observable<Product|ResponseError>{
    return this.http.get<Product|ResponseError>(this.sys_config.backend_cmm+'/products/'+id_product.toString(),{
      headers:this.getHeader()
    });
  }

  listProducts(opt:Options):Observable<Product[]|RequestResponse|ResponseError>{
    return this.http.get<Product[]|RequestResponse|ResponseError>(this.sys_config.backend_cmm+'/products/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  save(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products/'+(data.id>0?data.id.toString():''),data,{
      headers:this.getHeader(ContentType.json)
    });
  }

  delete(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/products/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }

  listGrid(opt:Options):Observable<RequestResponse|ProductGrid[]|ResponseError>{
    return this.http.get<RequestResponse|ProductGrid[]|ResponseError>(this.sys_config.backend_cmm+'/products-grid/',{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadGrid(id:number):Observable<ProductGrid|ResponseError>{
    return this.http.get<ProductGrid|ResponseError>(this.sys_config.backend_cmm+'/products-grid/'+id.toString(),{
      headers: this.getHeader()
    });
  }

  saveGrid(data:any):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products-grid/'+(data.id>0?data.id.toString():''),data,{
      headers: this.getHeader(ContentType.json)
    });
  }

  deleteGrid(ids:number[],toTrash:boolean):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/products-grid/",{
      headers: this.getHeader(ContentType.json),
      body: {
        toTrash: toTrash,
        ids: ids
      }
    });
  }


  listGridDistribution(idGrid:number,opt:Options):Observable<RequestResponse|ProductGridDistribution[]|ResponseError>{
    return this.http.get<RequestResponse|ProductGridDistribution[]|ResponseError>(this.sys_config.backend_cmm+'/products-grid/distribution/'+idGrid.toString(),{
      headers: this.getHeader(),
      params: this.getParams(opt)
    });
  }

  loadGridDistribution(idGrid:number,id_color:number):Observable<ProductGridDistribution|ResponseError>{
    return this.http.get<ProductGridDistribution|ResponseError>(this.sys_config.backend_cmm+'/products-grid/distribution/'+idGrid.toString(),{
      headers: this.getHeader(),
      params: new HttpParams().set("query","is:only-one 1||is:color "+id_color.toString())
    });
  }

  saveGridDistribution(idGrid:number,data:ProductGridDistribution):Observable<number|boolean|ResponseError>{
    return this.http.post<number|boolean|ResponseError>(this.sys_config.backend_cmm+'/products-grid/distribution/'+idGrid.toString(),
    JSON.stringify(data),{
      headers: this.getHeader(ContentType.json)
    });
  }

  deleteGridDistribution(id:number,id_color:number):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_cmm+"/products-grid/distribution/"+id.toString(),{
      headers: this.getHeader(ContentType.json),
      body: {
        id_color: id_color
      }
    });
  }
}
