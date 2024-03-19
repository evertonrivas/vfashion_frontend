import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { SizeService } from 'src/app/services/size.service';
import { RequestResponse } from 'src/app/models/paginate.model';

@Component({
    selector: 'app-sizes',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './sizes.component.html',
    styleUrl: './sizes.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class SizesComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private svc:SizeService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef){
    super(route);
  }
  
  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this
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
