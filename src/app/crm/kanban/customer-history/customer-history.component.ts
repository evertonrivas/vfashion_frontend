import { Component, Input,OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/classes/common';
import { HistoryResponse } from 'src/app/models/entity.model';
import { RequestResponse } from 'src/app/models/paginate.model';
import { CrmService } from 'src/app/services/crm.service';
import { EntitiesService } from 'src/app/services/entities.service';

@Component({
  selector: 'app-customer-history',
  templateUrl: './customer-history.component.html',
  styleUrls: ['./customer-history.component.scss']
})
export class CustomerHistoryComponent extends Common implements OnChanges{
  @Input() loadHistory:boolean = false;
  @Input() idCustomer:number = 0;
  search:string = "";

  constructor(
    private svc:EntitiesService,
    route:Router
  ){
    super(route);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.loadHistory==true){
      this.listHistory();
    }
  }

  listHistory():void{
    this.svc.loadHistory(this.idCustomer,this.options).subscribe({
      next: (data) =>{
        this.response = data as HistoryResponse;
      }
    });
  }

  searchHistory(){
    this.options.page = 1;
    this.options.query = "is:search "+this.search;
    this.listHistory();
  }
}
