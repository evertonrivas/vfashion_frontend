import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { MyHttp, ContentType } from './my-http';
import { CartContent, CartItem, OrderHistory, PaymentCondition } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';
import { Options, RequestResponse, ResponseError } from '../models/paginate.model';


@Injectable({
  providedIn: 'root'
})
export class B2bOrderService extends MyHttp{
  private productAnnouced = new Subject<any|null>();

  productAnnouced$ = this.productAnnouced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  annouceProduct(){
    this.productAnnouced.next(null);
  }

  listGallery(options:Options):Observable<Product[]|RequestResponse|ResponseError>{
    return this.http.get<Product[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/product-stock/gallery/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }

  get_stock(id_product:number):Observable<Product[]>{
    return this.http.get<Product[]>(this.sys_config.backend_b2b+'/product-stock/load-by-product/'+id_product,{
      headers: this.getHeader()
    });
  }

  //adiciona os produtos ao carrinho de compras apenas
  addToCart(cItens:CartItem[]):Observable<boolean|ResponseError>{
    return this.http.post<boolean|ResponseError>(this.sys_config.backend_b2b+'/cart/',cItens,{
      headers: this.getHeader(ContentType.json)
    });
  }

  //adiciona produtos usando a grade padrao, para isso soh utiliza o codigo do produto, codigo da cor e codigo do cliente
  addGridToCart(p_products:number[],p_idColor:number,p_idCustomer:number):Observable<boolean|ResponseError>{
    return this.http.put<boolean|ResponseError>(this.sys_config.backend_b2b+'/cart/',
    {
      customer: p_idCustomer,
      color: p_idColor,
      products: p_products
    },{
      headers: this.getHeader(ContentType.json)
    });
  }

  //finaliza a ordem juntando a condicao de pagamento
  finishOrder(id_payment:number,
    total_value:number,
    installments:number,
    installment_value:number,
    total_itens:number):Observable<number|ResponseError>{

    return this.http.post<number|ResponseError>(this.sys_config.backend_b2b+'/orders/',{
      "make_online": true,
      "id_payment_condition": id_payment,
      "id_customer": localStorage.getItem("id_profile"),
      "total_value": total_value,
      "total_itens": total_itens,
      "installments": installments,
      "installment_value": installment_value
    },{
        headers: this.getHeader(ContentType.json)
      }
    );
  }

  getItemData(prod:Product,idProfile:number,userType:string):Observable<CartContent|ResponseError>{
    return this.http.get<CartContent|ResponseError>(this.sys_config.backend_b2b+'/cart/'+prod.id.toString()+'?id_profile='+idProfile.toString(),{
      headers: this.getHeader(),
      params: new HttpParams().set('userType',userType)
    });
  }

  listMyItens(idProfile:number,userType:string):Observable<CartContent[]|RequestResponse|ResponseError>{
    return this.http.get<CartContent[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/cart/?id_profile='+idProfile.toString(),{
      headers: this.getHeader(),
      params: new HttpParams().set('userType',userType)
    });
  }

  listPayment(opt:Options):Observable<PaymentCondition[]|RequestResponse|ResponseError>{
    return this.http.get<PaymentCondition[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/payment-conditions/',{
      headers: this.getHeader(),
      params: new HttpParams().set("page",opt.page).set("pageSize",opt.pageSize).set("query",opt.query)
    });
  }

  delete(ids:number[]):Observable<boolean|ResponseError>{
    return this.http.delete<boolean|ResponseError>(this.sys_config.backend_b2b+'/cart/',{
      headers: this.getHeader(ContentType.json),
      body: JSON.stringify(ids)
    });
  }

  listMyOrders(options:Options):Observable<OrderHistory[]|RequestResponse|ResponseError>{
    return this.http.get<OrderHistory[]|RequestResponse|ResponseError>(this.sys_config.backend_b2b+'/orders/history/'+localStorage.getItem("id_profile"),{
      headers: this.getHeader(),
      params: new HttpParams().set("page",options.page).set("pageSize",options.pageSize).set("query",options.query)
    });
  }
}
