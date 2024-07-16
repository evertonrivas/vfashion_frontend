import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RepresentativeComponent } from './representative.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { VersionComponent } from '../common/version/version.component';
import { ReportsComponent } from '../reports/reports.component';
import { ProfileComponent } from '../common/profile/profile.component';

const routes: Routes = [
  { 
    path: '', 
    component: RepresentativeComponent,
    children:[{ path: 'dashboard', component: DashboardComponent},
      { path: 'version/:id', component: VersionComponent},
      { path: 'reports', component: ReportsComponent },
      { path: 'profile', component: ProfileComponent }]
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RepresentativeRoutingModule { }
