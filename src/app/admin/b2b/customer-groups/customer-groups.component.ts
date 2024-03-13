import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";

@Component({
    selector: 'app-customer-groups',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './customer-groups.component.html',
    styleUrl: './customer-groups.component.scss',
    imports: [
        SharedModule,
        CommonModule,
        FilterComponent
    ]
})
export class CustomerGroupsComponent extends Common implements AfterViewInit{
  constructor(route:Router){
    super(route);
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

}
