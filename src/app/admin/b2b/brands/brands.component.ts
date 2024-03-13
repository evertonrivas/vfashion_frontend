import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { FilterComponent } from 'src/app/common/filter/filter.component';
import { SharedModule } from 'src/app/common/shared.module';
import { Field } from 'src/app/models/field.model';
import { FieldType } from 'src/app/models/system.enum';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    FilterComponent
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService){
    super(route);
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

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = false;
    this.options.page = ((evt.page as number)+1);
    // this.serviceSub[0] = this.svc.userList(this.options).subscribe({
    //   next: (data) =>{
    //     this.response = data as RequestResponse;
    //     this.cdr.detectChanges();
    //     this.loading = false;
    //   }
    // });
  }

  editData(id:number):void{

  }
}
