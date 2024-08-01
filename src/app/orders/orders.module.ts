import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrdersRoutingModule } from './orders-routing.module';
import { OrdersComponent } from './orders.component';
import { SharedModule } from '../common/shared.module';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    OrdersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TopbarComponent,
    OrdersRoutingModule
  ]
})
export class OrdersModule { }
