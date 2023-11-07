import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesforceRoutingModule } from './salesforce-routing.module';
import { SalesforceComponent } from './salesforce.component';
import { SharedModule } from '../common/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { GridComponent } from './grid/grid.component';
import { HistoryComponent } from './history/history.component';
import { OrderComponent } from './order/order.component';
import { ReturnComponent } from './return/return.component';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    SalesforceComponent,
    GridComponent,
    HistoryComponent,
    OrderComponent,
    ReturnComponent
  ],
  imports: [
    CommonModule,
    SalesforceRoutingModule,
    SharedModule,
    SidebarModule,
    MultiSelectModule,
    ImageModule,
    CheckboxModule,
    TopbarComponent
  ]
})
export class SalesforceModule { }
