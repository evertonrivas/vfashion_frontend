import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse } from 'src/app/models/paginate.model';
import { B2bReturnService } from 'src/app/services/b2b.return.service';
import { FilterComponent } from "../../../common/filter/filter.component";

@Component({
    selector: 'app-reasons',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './reasons.component.html',
    styleUrl: './reasons.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class ReasonsComponent extends Common implements AfterViewInit{
  constructor(route:Router, private svc:B2bReturnService,
    private cdr:ChangeDetectorRef){
    super(route)
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[0] = this.svc.listReasons(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  editData(id:number):void{

  }

}
