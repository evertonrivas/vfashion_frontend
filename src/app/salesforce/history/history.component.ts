import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { OrderHistory } from 'src/app/models/order.model';
import { RequestResponse } from 'src/app/models/paginate.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends Common implements AfterViewInit{
  showIntegration:boolean = false;
  showIntegrationTrack:boolean = false;
  selectedOrder:OrderHistory = {
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
    integrated: false,
    integration_number: null,
    invoice_number: null,
    track: null,
    date_created: ''
  };
  constructor(route:Router,
    private svc:B2bOrderService){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadHistory();
  }

  loadHistory(evt:PaginatorState = { page:0, pageCount:1 }):void{
    this.options.page = (evt.page as number)+1;
    this.svc.listMyOrders(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        (this.response.data as OrderHistory[]).forEach((oh) =>{
          if(oh.integrated==true){
            this.showIntegration = true;
            if(oh.track!=null){
              this.showIntegrationTrack = true;
            }
          }
        })
      }
    });
  }

  showTrack(p_idOrder:string):void{
    this.selectedOrder = (this.response.data as OrderHistory[]).find((oh) => oh.id_order==p_idOrder) as OrderHistory;
    this.showDialog = true;
  }
}
