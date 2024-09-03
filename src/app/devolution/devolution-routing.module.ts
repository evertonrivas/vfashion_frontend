import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DevolutionComponent } from './devolution.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { VersionComponent } from '../common/version/version.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { ProcessComponent } from './process/process.component';
import { ReportManagerComponent } from '../common/report-manager/report-manager.component';


const routes: Routes = [
  { 
    path: '', 
    component: DevolutionComponent,
    children:[{ path: 'dashboard', component: DashboardComponent},
      { path: 'version/:id', component: VersionComponent},
      { path: 'process', component: ProcessComponent },
      { path: 'reports', component: ReportManagerComponent },
      { path: 'profile', component: ProfileComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevolutionRoutingModule { }
