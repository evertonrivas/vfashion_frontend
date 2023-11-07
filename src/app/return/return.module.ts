import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReturnRoutingModule } from './return-routing.module';
import { ReturnComponent } from './return.component';
import { SharedModule } from '../common/shared.module';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    ReturnComponent
  ],
  imports: [
    CommonModule,
    ReturnRoutingModule,
    SharedModule,
    TopbarComponent
  ]
})
export class ReturnModule { }
