import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesforceComponent } from './salesforce.component';
import { ProfileComponent } from '../common/profile/profile.component';

const routes: Routes = [{ 
  path: '', 
  component: SalesforceComponent,
  children:[{
    path: 'profile',
    component: ProfileComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesforceRoutingModule { }
