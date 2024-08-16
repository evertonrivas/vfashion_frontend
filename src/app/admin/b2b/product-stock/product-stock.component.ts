import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { FilterComponent } from 'src/app/common/filter/filter.component';
import { FormComponent } from 'src/app/common/form/form.component';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse } from 'src/app/models/paginate.model';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-product-stock',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FilterComponent,
    FormComponent
  ],
  templateUrl: './product-stock.component.html',
  styleUrl: './product-stock.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class ProductStockComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private svc:StockService
  ){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }

  loadingData(evt:PaginatorState = {page:0, pageCount:0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("trash 1||","");
      }
    }

    this.serviceSub[1] = this.svc.list(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{

  }

  onEditData(id:number = 0):void{

  }

  onDataSave(data:any):void{

  }

  onDataDelete(pSendToTrash:boolean):void{
    
  }
}
