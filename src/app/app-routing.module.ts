import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { SelectorComponent } from './common/selector/selector.component';

const routes: Routes = [{
  path:'', pathMatch: 'full', redirectTo: '/login'
},{
  path: 'login', component:LoginComponent
},{
  path: 'selector',component:SelectorComponent
},
{ path: 'salesforce', loadChildren: () => import('./salesforce/salesforce.module').then(m => m.SalesforceModule) },
{ path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
{ path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule) },
{ path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
{ path: 'return', loadChildren: () => import('./return/return.module').then(m => m.ReturnModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
