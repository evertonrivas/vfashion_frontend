import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevolutionRoutingModule } from './devolution-routing.module';
import { DevolutionComponent } from './devolution.component';
import { SharedModule } from '../common/shared.module';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    DevolutionComponent
  ],
  imports: [
    CommonModule,
    DevolutionRoutingModule,
    SharedModule,
    TopbarComponent
  ]
})
export class DevolutionModule { }
