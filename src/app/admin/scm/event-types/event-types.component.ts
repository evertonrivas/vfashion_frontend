import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { CalendarService } from 'src/app/services/calendar.service';
import { RequestResponse } from 'src/app/models/paginate.model';
import { PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-event-types',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './event-types.component.html',
    styleUrl: './event-types.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        TagModule
    ]
})
export class EventTypesComponent extends Common implements AfterViewInit{
  constructor(route:Router,
    private svc:CalendarService,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
    this.svc.eventTypeList(this.options).subscribe({
      next:(data) =>{
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
