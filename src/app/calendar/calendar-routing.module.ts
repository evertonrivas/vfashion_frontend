import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './calendar.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { GanttComponent } from './gantt/gantt.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { FlimvComponent } from './flimv/flimv.component';
import { ReportsComponent } from '../reports/reports.component';


const routes: Routes = [{ 
  path: '', 
  component: CalendarComponent,
  children:[{
    path: 'dashboard',
    component: DashboardComponent
  },{
    path: 'gantt',
    component: GanttComponent
  },{
    path: 'profile',
    component: ProfileComponent
  },{
    path:'flimv',
    component: FlimvComponent
  },{
    path:'reports',
    component: ReportsComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
