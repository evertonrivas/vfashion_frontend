import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RepresentativeRoutingModule } from './representative-routing.module';
import { RepresentativeComponent } from './representative.component';
import { SharedModule } from '../common/shared.module';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    RepresentativeComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    TopbarComponent,
    RepresentativeRoutingModule
  ]
})
export class RepresentativeModule { }
