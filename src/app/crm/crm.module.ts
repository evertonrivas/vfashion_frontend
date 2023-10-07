import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CrmRoutingModule } from './crm-routing.module';
import { CrmComponent } from './crm.component';
import { SharedModule } from '../shared/shared.module';
import { KanbanComponent } from './kanban/kanban.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { DividerModule } from 'primeng/divider';
import { BadgeModule } from 'primeng/badge';
import { CheckboxModule } from 'primeng/checkbox';
import { SidebarModule } from 'primeng/sidebar';
import { DragDropModule } from 'primeng/dragdrop';
import { PaginatorModule } from 'primeng/paginator';
import { TabViewModule } from 'primeng/tabview';
import { InputMaskModule } from 'primeng/inputmask';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
import { DataViewModule } from 'primeng/dataview';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CustomerDataComponent } from './kanban/customer-data/customer-data.component';
import { CustomerFileComponent } from './kanban/customer-file/customer-file.component';
import { CustomerEmailComponent } from './kanban/customer-email/customer-email.component';
import { CustomerHistoryComponent } from './kanban/customer-history/customer-history.component';
import { ReportsComponent } from './reports/reports.component';
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EditorModule } from 'primeng/editor';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
  declarations: [
    CrmComponent,
    KanbanComponent,
    CustomerDataComponent,
    CustomerFileComponent,
    CustomerEmailComponent,
    CustomerHistoryComponent,
    ReportsComponent
  ],
  imports: [
    CommonModule,
    CrmRoutingModule,
    SharedModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    CardModule,
    PanelModule,
    TooltipModule,
    MenuModule,
    OverlayPanelModule,
    SplitButtonModule,
    ProgressBarModule,
    DividerModule,
    BadgeModule,
    CheckboxModule,
    SidebarModule,
    DragDropModule,
    PaginatorModule,
    TabViewModule,
    InputMaskModule,
    DialogModule,
    InputTextareaModule,
    FileUploadModule,
    DataViewModule,
    AutoCompleteModule,
    ConfirmDialogModule,
    NgxMaskPipe,
    NgxMaskDirective,
    EditorModule,
    CalendarModule
  ],
  providers:[
    provideNgxMask()
  ]
})
export class CrmModule { }
