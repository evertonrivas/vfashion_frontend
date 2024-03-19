import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { CollectionService } from 'src/app/services/collection.service';
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse } from 'src/app/models/paginate.model';
import { SysFilterService } from 'src/app/services/sys.filter.service';
import { FieldType } from 'src/app/models/system.enum';

@Component({
    selector: 'app-collections',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './collections.component.html',
    styleUrl: './collections.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class CollectionsComponent extends Common implements AfterViewInit, OnDestroy{

  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private sfil:SysFilterService,
    private svc:CollectionService){
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
