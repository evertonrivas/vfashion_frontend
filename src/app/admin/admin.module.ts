import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { AppMenuitemComponent } from './app.menuitem.component';


@NgModule({
  declarations: [
    AdminComponent,
    AppMenuitemComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    SidebarModule
  ]
})
export class AdminModule { }
