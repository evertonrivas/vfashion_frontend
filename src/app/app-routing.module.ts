import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';

const routes: Routes = [
{ path: 'login', component:LoginComponent },
{ path: 'salesforce', loadChildren: () => import('./salesforce/salesforce.module').then(m => m.SalesforceModule) },
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
{ path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
{ path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
{ path: 'devolution', loadChildren: () => import('./devolution/devolution.module').then(m => m.DevolutionModule) },
{ path: 'representative', loadChildren: () => import('./representative/representative.module').then(m => m.RepresentativeModule) },
{
  path:'', pathMatch: 'full', redirectTo: '/login'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
