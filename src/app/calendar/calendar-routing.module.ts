import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { GanttComponent } from './gantt/gantt.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { FlimvComponent } from './flimv/flimv.component';
import { VersionComponent } from '../common/version/version.component';
import { RepComissionComponent } from './rep-comission/rep-comission.component';
import { ReportManagerComponent } from '../common/report-manager/report-manager.component';


const routes: Routes = [{ 
  path: '', 
  component: CalendarComponent,
  children:[
    { path: 'dashboard', component: DashboardComponent },
    { path: 'version', component: VersionComponent },
    { path: 'gantt', component: GanttComponent },
    { path: 'profile', component: ProfileComponent },
    { path:'flimv', component: FlimvComponent },
    { path:'reports', component: ReportManagerComponent },
    { path: 'comission', component: RepComissionComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
