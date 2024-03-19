import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SharedModule } from 'src/app/common/shared.module';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { FilterComponent } from "../../../common/filter/filter.component";
import { RequestResponse } from 'src/app/models/paginate.model';
import { SizeService } from 'src/app/services/size.service';
import { PaymentConditionService } from 'src/app/services/payment-condition.service';
import { FieldType } from 'src/app/models/system.enum';
import { SysFilterService } from 'src/app/services/sys.filter.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FilterComponent
  ],
  providers:[
    MessageService,
    ConfirmationService
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent extends Common implements AfterViewInit, OnDestroy{
  constructor(route:Router,
    private svc:PaymentConditionService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private sfil:SysFilterService,
    private cdr:ChangeDetectorRef){
    super(route);

    this.serviceSub[0] = this.sfil.filterSysAnnounced$.subscribe({
      next:(data) =>{
        this.options.query = data;
        this.loadingData();
      }
    });

  }

  ngOnDestroy(): void {
    this.serviceSub.forEach((f) =>{
      f.unsubscribe();
    });
  }
  
  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.loading = false;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[1] = this.svc.list(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto",
      placeholder: "Nome...",
      name: "text",
      filter_name: "search",
      filter_prefix: "is",
      options:undefined,
      value:undefined,
      type: FieldType.INPUT
    });

    this.filters.push({
      label:"Parcela(s)",
      placeholder:"Número",
      name:"installments",
      filter_name:"installments",
      filter_prefix:"is",
      options:undefined,
      value:undefined,
      type:FieldType.NUMBER
    });

    this.filters.push({
      label:"Dia(s) para recebimento ",
      placeholder:"Número",
      name:"received_days",
      filter_name:"received_days",
      filter_prefix:"is",
      options:undefined,
      value:undefined,
      type:FieldType.NUMBER
    });
  }

  editData(id:number):void{

  }
}
