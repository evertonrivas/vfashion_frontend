import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { SharedModule } from '../common/shared.module';
import { SidebarModule } from 'primeng/sidebar';
import { AppMenuitemComponent } from './app.menuitem.component';
import { TopbarComponent } from '../common/topbar/topbar.component';


@NgModule({
  declarations: [
    AdminComponent,
    AppMenuitemComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    SidebarModule,
    TopbarComponent
  ]
})
export class AdminModule { }
