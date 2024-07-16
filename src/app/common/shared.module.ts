import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CnpjCpfPipe } from 'src/app/pipes/cnpj-cpf.pipe';
import { EntityTypePipe } from 'src/app/pipes/entity-type.pipe';
import { NameCutPipe } from 'src/app/pipes/name-cut.pipe';
import { ShortMoneyPipe } from 'src/app/pipes/short-money.pipe';
import { UserTypePipe } from 'src/app/pipes/user-type.pipe';
import { TopbarComponent } from './topbar/topbar.component';
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
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputMaskModule } from 'primeng/inputmask';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { SidebarModule } from 'primeng/sidebar';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { OrderStatusPipe } from '../pipes/order-status.pipe';
import { DevolutionStatusPipe } from '../pipes/devolution-status.pipe';

@NgModule({
  declarations: [
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    ShortMoneyPipe,
    EntityTypePipe,
    TranslatePipe,
    CepPipe,
    CustomerActionPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    OrderStatusPipe,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    InputMaskModule,
    NgxMaskPipe,
    NgxMaskDirective,
    OverlayPanelModule,
    PanelModule,
    PaginatorModule,
    RippleModule,
    SidebarModule,
    SkeletonModule,
    TableModule,
    ToastModule,
    TooltipModule,
    MultiSelectModule,
    ToggleButtonModule,
    DevolutionStatusPipe,
    DatePipe
  ],
  exports:[
    CnpjCpfPipe,
    UserTypePipe,
    NameCutPipe,
    OrderStatusPipe,
    ShortMoneyPipe,
    EntityTypePipe,
    TranslatePipe,
    CustomerActionPipe,
    CepPipe,
    DevolutionStatusPipe,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    ConfirmDialogModule,
    DataViewModule,
    DialogModule,
    DropdownModule,
    InputTextModule,
    InputNumberModule,
    InputMaskModule,
    NgxMaskPipe,
    NgxMaskDirective,
    OverlayPanelModule,
    PanelModule,
    PaginatorModule,
    RippleModule,
    SidebarModule,
    SkeletonModule,
    TableModule,
    ToastModule,
    TooltipModule,
    MultiSelectModule,
    ToggleButtonModule,
    DatePipe
  ]
})
export class SharedModule { }
