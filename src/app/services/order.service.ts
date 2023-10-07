import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable,Subject } from 'rxjs';
import { MyHttp, ContentType } from './my-http';
import { CartContent, CartItem, HistoryOptions, PaginativeHistory, PaymentCondition } from 'src/app/models/order.model';
import { Product } from 'src/app/models/product.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService extends MyHttp{
  private productAnnouced = new Subject<any|null>();

  productAnnouced$ = this.productAnnouced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  annouceProduct(){
    this.productAnnouced.next(null);
  }

  //adiciona os produtos ao carrinho de compras apenas
  addToCart(cItens:CartItem[]):Observable<boolean>{

    return this.http.post<boolean>(this.sys_config.backend_b2b+'/cart/',cItens,{
      headers: this.getHeader(ContentType.json)
    });
  }

  //finaliza a ordem juntando a condicao de pagamento
  finishOrder(id_payment:number,
    total_value:number,
    installments:number,
    installment_value:number,
    total_itens:number):Observable<number>{

    return this.http.post<number>(this.sys_config.backend_b2b+'/orders/',{
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

  countMyItens():Observable<number>{
    return this.http.get<number>(this.sys_config.backend_b2b+'/cart/total/'+localStorage.getItem("id_profile"),{
      headers: this.getHeader()
    });
  }

  getItemData(prod:Product):Observable<CartContent>{
    return this.http.get<CartContent>(this.sys_config.backend_b2b+'/cart/'+prod.id.toString()+'?id_profile='+localStorage.getItem("id_profile"))
  }

  listMyItens():Observable<CartContent[]>{
    return this.http.get<CartContent[]>(this.sys_config.backend_b2b+'/cart/?id_profile='+localStorage.getItem("id_profile"),{
      headers: this.getHeader()
    });
  }

  listPayment():Observable<PaymentCondition[]>{
    return this.http.get<PaymentCondition[]>(this.sys_config.backend_b2b+'/payment-conditions/',{
      headers: this.getHeader(),
      params:this.getListAll(false,"name")
    });
  }

  delete(ids:number[]):Observable<boolean>{
    return this.http.delete<boolean>(this.sys_config.backend_b2b+'/cart/',{
      headers: this.getHeader(ContentType.json),
      body: JSON.stringify(ids)
    });
  }

  listMyOrders(options:HistoryOptions):Observable<PaginativeHistory>{
    let httpParams = new HttpParams();
    if(options.orderBy!=null){
      httpParams = httpParams.set("order_by",String(options.orderBy))
      .set("order_dir",options.orderDir);
    }
    if(options.pagSize!=null){
      httpParams = httpParams.set("pageSize",String(options.pagSize));
    }
    httpParams = httpParams.set("page",String(options.page));
    return this.http.get<PaginativeHistory>(this.sys_config.backend_b2b+'/orders/history/'+localStorage.getItem("id_profile"),{
      headers: this.getHeader(),
      params: httpParams
    });
  }
}
