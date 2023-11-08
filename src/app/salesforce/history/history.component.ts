import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse } from 'src/app/models/paginate.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent extends Common{

  constructor(route:Router,
    private svc:B2bOrderService){
    super(route);
  }

  loadHistory(evt:PaginatorState = { page:0, pageCount:1 }):void{
    this.options.page = (evt.page as number)+1;
    this.svc.listMyOrders(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
      }
    });
  }
}
