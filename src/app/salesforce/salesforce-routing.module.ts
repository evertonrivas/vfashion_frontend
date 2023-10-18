import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesforceComponent } from './salesforce.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { GridComponent } from './grid/grid.component';
import { HistoryComponent } from './history/history.component';
import { OrderComponent } from './order/order.component';
import { ReturnComponent } from './return/return.component';

const routes: Routes = [{ 
  path: '', 
  component: SalesforceComponent,
  children:[{ path: 'profile', component: ProfileComponent },
  { path: 'grid', component: GridComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'order', component: OrderComponent },
  { path: 'return', component: ReturnComponent }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesforceRoutingModule { }
