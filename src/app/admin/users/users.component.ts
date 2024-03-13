import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse } from 'src/app/models/paginate.model';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/common/shared.module';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../../common/filter/filter.component";

@Component({
    selector: 'app-users',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class UsersComponent extends Common implements AfterViewInit{

  constructor(route:Router,
    private svc:UserService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[0] = this.svc.userList(this.options).subscribe({
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
