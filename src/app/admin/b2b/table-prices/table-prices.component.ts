import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse } from 'src/app/models/paginate.model';
import { TablePriceService } from 'src/app/services/table-price.service';

@Component({
    selector: 'app-table-prices',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './table-prices.component.html',
    styleUrl: './table-prices.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class TablePricesComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private svc:TablePriceService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef){
    super(route);
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  
  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.loading = false;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[0] = this.svc.list(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{

  }

  editData(id:number):void{

  }
}
