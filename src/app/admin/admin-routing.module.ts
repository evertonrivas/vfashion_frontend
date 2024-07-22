import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from '../common/dashboard/dashboard.component';
import { ConfigComponent } from '../common/config/config.component';
import { ConfigComponent as ConfigB2B } from '../common/config/config.component';
import { ConfigComponent as ConfigFPR } from '../common/config/config.component';
import { ConfigComponent as ConfigSCM } from '../common/config/config.component';
import { EntitiesComponent } from './entities/entities.component';
import { ProductsComponent } from './products/products.component';
import { UsersComponent } from './users/users.component';
import { BrandsComponent } from './b2b/brands/brands.component';
import { CollectionsComponent } from './b2b/collections/collections.component';
import { ColorsComponent } from './b2b/colors/colors.component';
import { CustomerGroupsComponent } from './b2b/customer-groups/customer-groups.component';
import { ModelsComponent } from './b2b/models/models.component';
import { ProductGridComponent } from './b2b/product-grid/product-grid.component';
import { ProductTypeComponent } from './b2b/product-type/product-type.component';
import { SizesComponent } from './b2b/sizes/sizes.component';
import { TablePricesComponent } from './b2b/table-prices/table-prices.component';
import { CategoriesComponent } from './b2b/categories/categories.component';
import { FunnelsComponent } from './crm/funnels/funnels.component';
import { FunnelStagesComponent } from './crm/funnel-stages/funnel-stages.component';
import { ConfigComponent as CrmConfigComponent } from './crm/config/config.component';
import { StepsComponent } from './fpr/steps/steps.component';
import { ReasonsComponent } from './fpr/reasons/reasons.component';
import { EventTypesComponent } from './scm/event-types/event-types.component';
import { PaymentComponent } from './b2b/payment/payment.component';
import { MeasureUnitComponent } from './measure-unit/measure-unit.component';
import { ProfileComponent } from '../common/profile/profile.component';
import { VersionComponent } from '../common/version/version.component';
import { ImportEntitiesComponent } from './import/import-entities/import-entities.component';
import { ImportProductsComponent } from './import/import-products/import-products.component';

const routes: Routes = [{ 
  path: '', 
  component: AdminComponent,
  children:[
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'configurations', component: ConfigComponent },
    { path: 'entities', component: EntitiesComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'measure-unit', component: MeasureUnitComponent },
    { path: 'users', component: UsersComponent },
    { path: 'version/:id', component: VersionComponent },
    {
      path: 'b2b',
      children: [
        { path: 'configurations', component: ConfigB2B },
        { path: 'brands', component: BrandsComponent },
        { path: 'categories', component: CategoriesComponent },
        { path: 'collections', component: CollectionsComponent },
        { path: 'colors', component: ColorsComponent },
        { path: 'customer-groups', component: CustomerGroupsComponent },
        { path: 'models', component: ModelsComponent },
        { path: 'product-grids', component: ProductGridComponent },
        { path: 'product-types', component: ProductTypeComponent },
        { path: 'sizes', component: SizesComponent },
        { path: 'table-prices', component: TablePricesComponent },
        { path: 'payment-condition', component: PaymentComponent }
      ]
    },{
      path: 'crm',
      children:[
        { path: 'config', component: CrmConfigComponent },
        { path: 'funnels', component: FunnelsComponent },
        { path: 'funnel-stages', component: FunnelStagesComponent }
      ]
    },{
      path:'fpr',
      children:[
        { path: 'configurations', component: ConfigFPR },
        { path: 'steps', component: StepsComponent },
        { path: 'reasons', component: ReasonsComponent }
      ]
    },{
      path: 'scm',
      children: [
        { path: 'configurations', component: ConfigSCM },
        { path: 'event-types', component: EventTypesComponent }
      ]
    },{
      path: 'import',
      children: [
        { path: 'entities', component: ImportEntitiesComponent },
        { path: 'products', component: ImportProductsComponent }
      ]
    }]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
