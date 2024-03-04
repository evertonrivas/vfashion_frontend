import { HttpHeaders } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/classes/common';
import { Order, OrderHistory, OrderProduct } from 'src/app/models/order.model';
import { Reason } from 'src/app/models/reason.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { B2bReturnService } from 'src/app/services/b2b.return.service';

export interface canUploadProduct{
  [index:number]:boolean
}

export interface reasonProduct{
  [index:number]:Reason
}

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent extends Common implements AfterViewInit{
  selectedOrder!:OrderHistory|undefined;
  localOrder!:Order|undefined;
  selectedOrderProducts:OrderProduct[] = [];
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));
  upload_max:number = this.sysconfig.company.max_upload_files as number;
  url_upload:string = this.sysconfig.backend_cmm+'/upload/return/';
  selectedProduct:canUploadProduct = {};
  selectedReason:reasonProduct = {};
  allReasons:Reason[] = [];
  constructor(route:Router,
    private svcOrd:B2bOrderService,
    private svcRet:B2bReturnService,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  ngAfterViewInit(): void {
    this.options.page = 1;
    this.options.pageSize = 1;
    this.options.query = 'can:list-all 1';
    this.svcOrd.listMyOrders(this.options).subscribe({
      next:(data) =>{
        this.response.data = data as OrderHistory[];

        this.svcRet.listReasons({page:1,pageSize:1,query:'can:list-all 1'}).subscribe({
          next: (data) =>{
            this.allReasons = data as Reason[];
          }
        });
      }
    });
  }

  loadOrder():void{
    if (this.selectedOrder!=undefined){
      this.svcOrd.loadOrder(parseInt(this.selectedOrder.id_order)).subscribe({
        next: (data) =>{
          if('id' in data){
            this.localOrder = data as Order;
            this.localOrder.products.forEach((p) =>{
              let id_product = p.id_product + p.id_color + p.id_size;
              if(this.selectedProduct[id_product]==undefined){
                this.selectedProduct[id_product] = true;
              }
              if(this.selectedReason[id_product]==undefined){
                this.selectedReason[id_product] = {};
              }
            })
            this.cdr.detectChanges();
          }else{
            console.log("erro na carga!");
          }
        }
      });
    }
  }
  
  cancelReturn():void{
    this.selectedOrder = undefined;
    this.localOrder    = undefined;
    this.showDialog    = false;
  }

  effectiveReturn():void{
    this.loading = true;
    //varrer os itens selecionados do pedido e mandar realizar a devolucao
    this.showDialog = false;
  }

  saveReturn():void{

  }

  setToUpload(evt:OrderProduct[]):void{
    //limpa a selecao para ser refeita
    Object.keys(this.selectedProduct).forEach((v) =>{
      this.selectedProduct[parseInt(v)] = true;
    })

    //define a selecao correta
    evt.forEach((p) =>{
      let id_product = p.id_product+p.id_color+p.id_size;
      this.selectedProduct[id_product] = false;
    });
  }
}
