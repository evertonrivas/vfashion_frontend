import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManagementComponent } from './management/management.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { VersionComponent } from '../common/version/version.component';
import { ReportsComponent } from '../reports/reports.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { OrdersComponent } from './orders.component';

const routes: Routes = [
  { 
    path: '', 
    component: OrdersComponent,
    children:[{ path: 'dashboard', component: DashboardComponent},
      { path: 'version/:id', component: VersionComponent},
      { path: 'management', component: ManagementComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'profile', component: ProfileComponent }]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
