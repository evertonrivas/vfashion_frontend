import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesforceRoutingModule } from './salesforce-routing.module';
import { SalesforceComponent } from './salesforce.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    SalesforceComponent
  ],
  imports: [
    CommonModule,
    SalesforceRoutingModule,
    SharedModule
  ]
})
export class SalesforceModule { }
