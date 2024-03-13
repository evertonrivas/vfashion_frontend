import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse } from 'src/app/models/paginate.model';
import { EntitiesService } from 'src/app/services/entities.service';
import { FilterComponent } from "../../common/filter/filter.component";
import { SysFilterService } from 'src/app/services/sys.filter.service';
import { Field } from 'src/app/models/field.model';
import { FieldType } from 'src/app/models/system.enum';

@Component({
    selector: 'app-entities',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './entities.component.html',
    styleUrl: './entities.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})

export class EntitiesComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private svc:EntitiesService,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private fil:SysFilterService){
    super(route);

    this.fil.filterSysAnnounced$.subscribe({
      next:(data) =>{
        this.options.query = data;
        this.loadingData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[0] = this.svc.listEntity(this.options).subscribe({
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
      placeholder:"CPF/CNPJ, Razão Social, Fantasia, Endereço, Estado, Cidade, Bairro",
      type: FieldType.INPUT,
      filter_name: "search",
      filter_prefix: "is",
      name:"search",
      options:undefined,
      value:undefined
    });
    
    this.filters.push({
      label:"Tipo",
      placeholder:"Selecione...",
      type: FieldType.COMBO,
      filter_name: "type",
      filter_prefix: "is",
      name:"type",
      options:[{option:'C',value:'Cliente'},{option:'R',value:'Representante'},{option:'S',value:'Fornecedor'}],
      value:undefined
    });
  }

  editData(id:number):void{
    
  }
}
