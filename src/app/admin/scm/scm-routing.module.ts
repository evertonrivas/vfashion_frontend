import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScmComponent } from './scm.component';

const routes: Routes = [{ path: '', component: ScmComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScmRoutingModule { }
