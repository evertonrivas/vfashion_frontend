import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from './crm.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { KanbanComponent } from './kanban/kanban.component';
import { ReportsComponent } from '../reports/reports.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { VersionComponent } from '../common/version/version.component';

const routes: Routes = [{ 
  path: '', 
  component: CrmComponent,
  children:[{ path: 'dashboard', component: DashboardComponent},
    { path: 'version/:id', component: VersionComponent},
    { path: 'kanban', component: KanbanComponent },
    { path: 'reports', component: ReportsComponent },
    { path: 'profile', component: ProfileComponent }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CrmRoutingModule { }
