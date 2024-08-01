import { AfterViewInit, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/common/shared.module';
import { Common } from 'src/app/classes/common';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { Order, OrderHistory } from 'src/app/models/order.model';
import { OrderStatus } from 'src/app/models/system.enum';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { TimelineModule } from 'primeng/timeline';
import { TagModule } from 'primeng/tag';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TimelineModule,
    TagModule
  ],
  providers:[MessageService],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent extends Common implements AfterViewInit{
  track_companies:any[] = ['BRASPRESS','JADLOG','JAMEF']
  showIntegration:boolean = false;
  showIntegrationTrack:boolean = false;
  status = OrderStatus;
  all_order_status:any[] = [0,1,2,3,4,5]
  selectedOrder:Order = {
    id: 0,
    customer: undefined,
    payment_condition: undefined,
    date: '',
    total_value: 0,
    total_itens: 0,
    installments: 0,
    installments_value: 0,
    status: OrderStatus.ANALIZING,
    integration_number: undefined,
    track_code: undefined,
    track_company: undefined,
    invoice_number: undefined,
    invoice_serie: undefined,
    date_created: '',
    date_updated: '',
    products: []
  };
  selectedOrderH:OrderHistory = {
    id_order: '',
    id_order_number:0,
    id_customer: 0,
    customer_name: '',
    id_payment_condition: 0,
    payment_name: '',
    total_value: 0,
    total_itens: 0,
    installments: 0,
    installment_value: 0,
    status: OrderStatus.SENDED,
    integration_number: null,
    invoice_number: null,
    track: null,
    date_created: ''
  };
  constructor(route:Router,
    private svc:B2bOrderService,
    private msg:MessageService
  ){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData(evt:PaginatorState = { page:0, pageCount:1 }):void{
    this.options.page = (evt.page as number)+1;
    this.svc.listMyOrders(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        (this.response.data as OrderHistory[]).forEach((oh) =>{
          if(oh.status==OrderStatus.TRANSPORTING){
            this.showIntegration = true;
            if(oh.track!=null){
              this.showIntegrationTrack = true;
            }
          }
        });
      }
    });
  }

  showTrack(p_idOrder:string):void{
    this.selectedOrderH = (this.response.data as OrderHistory[]).find((oh) => oh.id_order==p_idOrder) as OrderHistory;
    this.showDialog = true;
  }

  getSeverity(status:number):"success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined{
    if(status==OrderStatus.SENDED){
      return "warning";
    }else if(status==OrderStatus.PROCESSING){
      return "info";
    }else if(status==OrderStatus.TRANSPORTING){
      return "secondary";
    }else if(status==OrderStatus.REJECTED){
      return "danger";
    }else if(status==OrderStatus.ANALIZING){
      return "contrast";
    }
    return "success";
  }

  getColor(status:number):string | void{
    if(status==OrderStatus.FINISHED){
      return "#22c55e"; 
    }else if(status==OrderStatus.ANALIZING){
      return "#000000";
    }else if(status==OrderStatus.SENDED){
      return "#f97316";
    }else if(status==OrderStatus.PROCESSING){
      return "#0ea5e9";
    }else if(status==OrderStatus.TRANSPORTING){
      return "#64748b";
    }
    return "#ef4444";
  }

  onView(p_idOrder:string):void{
    // this.selectedOrder = (this.response.data as OrderHistory[]).find((oh) => oh.id_order==p_idOrder) as OrderHistory;
    this.svc.loadOrder(parseInt(p_idOrder)).subscribe({
      next: (data) =>{
        if ( "status" in data){
          this.selectedOrder = data as Order;
        }else{
          this.msg.add({
            summary:"Falha ao carregar...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
      }
    })
    this.formVisible = true;
  }

  onOrderNumber(id:number):string{
    return id.toString().padStart(10,"0");
  }

  onCloseView():void{
    this.selectedOrder = {
      id: 0,
      customer: undefined,
      payment_condition: undefined,
      date: '',
      total_value: 0,
      total_itens: 0,
      installments: 0,
      installments_value: 0,
      status: OrderStatus.ANALIZING,
      integration_number: undefined,
      track_code: undefined,
      track_company: undefined,
      invoice_number: undefined,
      invoice_serie: undefined,
      date_created: '',
      date_updated: '',
      products: []
    }
    this.formVisible = false;
  }

  saveOrder():void{
    this.loading = true;
    this.svc.saveOrder(this.selectedOrder).subscribe({
      next:(data) =>{
        this.loading = false;
        if(typeof data ==='boolean'){
          this.showDialog = false;
          this.msg.add({
            summary:'Successo!',
            severity:'success',
            detail: 'Pedido atualizado com sucesso!'
          });
        }else{
          this.msg.add({
            summary:"Falha ao salvar...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
      }
    });
  }
}
