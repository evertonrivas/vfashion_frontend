import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { SysFilterService } from 'src/app/services/sys.filter.service';
import { FieldType } from 'src/app/models/system.enum';
import { RequestResponse } from 'src/app/models/paginate.model';
import { PaginatorState } from 'primeng/paginator';
import { CrmService } from 'src/app/services/crm.service';

@Component({
    selector: 'app-funnels',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './funnels.component.html',
    styleUrl: './funnels.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class FunnelsComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private sfil:SysFilterService,
    private svc:CrmService){
    super(route);

    this.serviceSub[0] = this.sfil.filterSysAnnounced$.subscribe({
      next: (data) =>{
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
    this.loading = false;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[1] = this.svc.getFunnels(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto da Busca",
      placeholder:"Nome ou descrição",
      type: FieldType.INPUT,
      filter_name: "search",
      filter_prefix: "is",
      name:"",
      options:undefined,
      value:undefined
    });
  }

  editData(id:number):void{

  }

}
