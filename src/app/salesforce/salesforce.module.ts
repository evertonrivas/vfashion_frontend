import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesforceRoutingModule } from './salesforce-routing.module';
import { SalesforceComponent } from './salesforce.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { GridComponent } from './grid/grid.component';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { HistoryComponent } from './history/history.component';
import { OrderComponent } from './order/order.component';
import { ReturnComponent } from './return/return.component';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { RippleModule } from 'primeng/ripple';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';


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
    ButtonModule,
    DataViewModule,
    DropdownModule,
    PanelModule,
    PaginatorModule,
    DialogModule,
    ConfirmDialogModule,
    RippleModule,
    ImageModule,
    CheckboxModule
  ]
})
export class SalesforceModule { }
