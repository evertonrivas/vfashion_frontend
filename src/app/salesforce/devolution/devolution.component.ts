import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { FileUploadEvent } from 'primeng/fileupload';
import { Common } from 'src/app/classes/common';
import { Order, OrderHistory, OrderProduct } from 'src/app/models/order.model';
import { Reason,Devolution,DevolutionItem } from 'src/app/models/devolution.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { B2bDevolutionService } from 'src/app/services/b2b.devolution.service';
import { DevolutionStatus, OrderStatus } from 'src/app/models/system.enum';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';

export interface canUploadProduct{
  [index:string]:boolean
}

export interface uploadedProductPictures{
  [index:string]:string[]
}

export interface reasonProduct{
  [index:string]:Reason
}

export interface quantityProduct{
  [index:string]:number
}

@Component({
  selector: 'app-devolution',
  templateUrl: './devolution.component.html',
  styleUrls: ['./devolution.component.scss'],
  providers: [
    MessageService,
    ConfirmationService
  ],
})
export class DevolutionComponent extends Common implements AfterViewInit{
  //lista de pedidos
  allOrders:OrderHistory[] = [];
  //serve para o dropdown de selecao
  selectedOrder!:OrderHistory|undefined;
  //serve para exibir o pedido na tela
  localOrder!:Order|undefined;
  //serve para envio do cabecalho nos arquivos de upload
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));

  //selecoes realizadas
  selectedDevolutionProducts!:OrderProduct[];

  //objetos da devolucao
  localDevolution!:Devolution;
  
  //define os produtos que foram selecionados por checkbox
  selectedProduct:canUploadProduct = {};
  //listagem dos motivos
  allReasons:Reason[] = [];
  //motivos selecionados na tela
  selectedReason:reasonProduct = {};

  //quantidades informadas na tela
  selectedQuantity:quantityProduct = {};  
  //arquivos enviados ao servidor
  selectedFiles:uploadedProductPictures = {};
  
  //status das devolucoes para usar no html
  status = DevolutionStatus;

  constructor(route:Router,
    private svcOrd:B2bOrderService,
    private svcRet:B2bDevolutionService,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,){
    super(route);
  }

  ngAfterViewInit(): void {
    let options = {
      page: 1,
      pageSize: 1,
      query: 'can:list-all 1||is:status '+OrderStatus.FINISHED+'||'
    }
    this.svcOrd.listMyOrders(options).subscribe({
      next:(data) =>{
        this.allOrders = data as OrderHistory[];

        this.svcRet.listReasons({page:1,pageSize:1,query:'can:list-all 1'}).subscribe({
          next: (data) =>{
            this.allReasons = data as Reason[];
          }
        });
      }
    });

    this.loadingData();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    //se nao existe trash no query
    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"is:trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("is:trash 1||","");
      }
    }

    this.svcRet.listDevolution(this.options).subscribe({
      next:(data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadOrder():void{
    if (this.selectedOrder!=undefined){
      this.svcOrd.loadOrder(this.selectedOrder.id_order_number).subscribe({
        next: (data) =>{
          if('id' in data){
            this.localOrder = data as Order;
            this.localOrder.products.forEach((p) =>{
              if(this.selectedProduct[p.id_order_product]==undefined){
                this.selectedProduct[p.id_order_product] = true;
              }
              if(this.selectedReason[p.id_order_product]==undefined){
                this.selectedReason[p.id_order_product] = {
                  id:0,
                  description:undefined,
                  date_created:undefined,
                  date_updated:undefined
                };
              }
              if(this.selectedQuantity[p.id_order_product]==undefined){
                this.selectedQuantity[p.id_order_product] = 0;
              }
              if(this.selectedFiles[p.id_order_product]==undefined){
                this.selectedFiles[p.id_order_product] = [];
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
  
  onCancel():void{
    this.selectedOrder = undefined;
    this.localOrder    = undefined;
    this.showDialog    = false;
  }

  onEdit(p_id:string):void{
    if(p_id != ''){
      this.svcRet.getDevolution(parseInt(p_id)).subscribe({
        next: (data) =>{
          if ("id_order" in data){
            this.showDialog = true;
            this.localDevolution = data as Devolution;
            this.selectedOrder = this.allOrders.find(
              v => parseInt(v.id_order) == this.localDevolution.id_order
            ) as OrderHistory;
          }else{
            this.msg.add({
              summary:"Falha...",
              detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
              severity:"error"
            });
          }
        }
      });
    }
  }

  onSave(p_status:DevolutionStatus):void{
    this.hasSended = true;
    this.loading = true;
    let itens:DevolutionItem[] = [];

    let validated = true;
    Object.keys(this.selectedProduct).forEach((v) =>{
      //verifica apenas os produtos habilitados
      if(!this.selectedProduct[v]){
        if(this.selectedQuantity[v] == 0){
          validated = false;
        }
  
        if(this.selectedReason[v].id == 0){
          validated = false;
        }
      }
    });

    if(!validated){
      return;
    }

    this.selectedDevolutionProducts.forEach(p =>{
      itens.push({
        id_product: p.id_product,
        id_size: p.id_size,
        id_color: p.id_color,
        id_reason: this.selectedReason[p.id_order_product].id,
        quantity: this.selectedQuantity[p.id_order_product],
        picture_1: this.selectedFiles[p.id_order_product][0],
        picture_2: this.selectedFiles[p.id_order_product][1],
        picture_3: this.selectedFiles[p.id_order_product][2],
        picture_4: this.selectedFiles[p.id_order_product][3],
        status: false
      });
    });

    this.localDevolution = {
      id: 0,
      id_order: this.localOrder?.id as number,
      date: undefined,
      status: p_status,
      customer: undefined,
      order_date: undefined,
      items: itens
    }

    this.hasSended = true;
    this.svcRet.saveDevolution(this.localDevolution).subscribe({
      next: (data) =>{
        this.hasSended = false;
        this.showDialog = false;
        this.loading = false;
        if(typeof data ==='number'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro criado com sucesso!",
            severity:"success"
          });
        }else if(typeof data ==='boolean'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro atualizado com sucesso!",
            severity:"success"
          });
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
        this.loadingData();
      }
    });
  }

  setToUpload(evt:OrderProduct[]):void{
    //limpa a selecao para ser refeita
    Object.keys(this.selectedProduct).forEach((v) =>{
      this.selectedProduct[v] = true;
    });

    //define a selecao correta
    evt.forEach((p) =>{
      this.selectedProduct[p.id_order_product] = false;
    });

    this.selectedDevolutionProducts = evt;
  }

  setSendedPictures(event:FileUploadEvent,p_id_order_product:string){
    let response:HttpResponse<any> = event.originalEvent as HttpResponse<any>;
    //let files:string[] = response.body as string[];
    this.selectedFiles[p_id_order_product] = response.body as string[];
    // files.forEach(f =>{
    //   console.log(f);
    // });
  }

  getSeverity(status:number):"success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined{
    if(status==DevolutionStatus.SAVED){
      return "secondary";
    }else if(status==DevolutionStatus.APPROVED_ALL){
      return "success";
    }else if(status==DevolutionStatus.APPROVED_PART){
      return "info";
    }else if(status==DevolutionStatus.REJECTED){
      return "danger";
    }
    return "warning";
  }
}
