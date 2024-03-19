import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { ColorService } from 'src/app/services/color.service';
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse } from 'src/app/models/paginate.model';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-colors',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './colors.component.html',
    styleUrl: './colors.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        TagModule
    ]
})
export class ColorsComponent extends Common implements AfterViewInit {
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:ColorService){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
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
