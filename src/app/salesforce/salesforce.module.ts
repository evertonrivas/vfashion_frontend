import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesforceRoutingModule } from './salesforce-routing.module';
import { SalesforceComponent } from './salesforce.component';
import { SharedModule } from '../common/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { DividerModule } from 'primeng/divider';
import { GridComponent } from './grid/grid.component';
import { HistoryComponent } from './history/history.component';
import { AutoOrderComponent } from './auto-order/auto-order.component';
import { DevolutionComponent } from './devolution/devolution.component';
import { ImageModule } from 'primeng/image';
import { CheckboxModule } from 'primeng/checkbox';
import { TopbarComponent } from '../common/topbar/topbar.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { TimelineModule } from 'primeng/timeline';
import { FileUploadModule } from 'primeng/fileupload';
import { OrderStatusPipe } from "../pipes/order-status.pipe";


@NgModule({
  declarations: [
    SalesforceComponent,
    GridComponent,
    HistoryComponent,
    AutoOrderComponent,
    DevolutionComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    SalesforceRoutingModule,
    SharedModule,
    SidebarModule,
    MultiSelectModule,
    DividerModule,
    ImageModule,
    CheckboxModule,
    TopbarComponent,
    DataViewModule,
    TagModule,
    TimelineModule,
    FileUploadModule,
    OrderStatusPipe
]
})
export class SalesforceModule { }
