import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesforceComponent } from './salesforce.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { GridComponent } from './grid/grid.component';
import { HistoryComponent } from './history/history.component';
import { AutoOrderComponent } from './auto-order/auto-order.component';
import { DevolutionComponent } from './devolution/devolution.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { VersionComponent } from '../common/version/version.component';

const routes: Routes = [{ 
  path: '', 
  component: SalesforceComponent,
  children:[{ path: 'profile', component: ProfileComponent },
  { path: 'grid', component: GridComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'order', component: AutoOrderComponent },
  { path: 'devolution', component: DevolutionComponent },
  { path: 'checkout', component: CheckoutComponent},
  { path: 'version/:id', component: VersionComponent}]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesforceRoutingModule { }
