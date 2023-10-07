import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnpjCpfPipe } from 'src/app/pipes/cnpj-cpf.pipe';
import { EntityTypePipe } from 'src/app/pipes/entity-type.pipe';
import { NameCutPipe } from 'src/app/pipes/name-cut.pipe';
import { ShortMoneyPipe } from 'src/app/pipes/short-money.pipe';
import { UserTypePipe } from 'src/app/pipes/user-type.pipe';
import { TopbarComponent } from '../common/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { CepPipe } from 'src/app/pipes/cep.pipe';
import { TranslatePipe } from 'src/app/pipes/translate.pipe';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { CustomerActionPipe } from 'src/app/pipes/customer-action.pipe';
import { ChipsModule } from 'primeng/chips';


@NgModule({
  declarations: [
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    ShortMoneyPipe,
    EntityTypePipe,
    TranslatePipe,
    CepPipe,
    CustomerActionPipe,
    TopbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BadgeModule,
    OverlayPanelModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    TooltipModule,
    SkeletonModule,
    TableModule,
    ChipsModule
  ],
  exports:[
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    ShortMoneyPipe,
    EntityTypePipe,
    TranslatePipe,
    CustomerActionPipe,
    CepPipe,
    TopbarComponent,
    SkeletonModule,
    TableModule,
    TopbarComponent,
    ChipsModule
  ]
})
export class SharedModule { }
