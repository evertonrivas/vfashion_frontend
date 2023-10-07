import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from '../shared/shared.module';
import { SplitterModule } from 'primeng/splitter';
import { EventComponent } from './event/event.component';
import { MilestoneFormComponent } from './milestone-form/milestone-form.component';
import { FormsModule } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';
import { GanttComponent } from './gantt/gantt.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule as PCalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    CalendarComponent,
    EventComponent,
    MilestoneFormComponent,
    EventFormComponent,
    GanttComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    SplitterModule,
    FormsModule, 
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ConfirmDialogModule,
    DropdownModule,
    PCalendarModule,
    InputNumberModule,
    ToastModule,
    CascadeSelectModule,
    TooltipModule
  ]
})
export class CalendarModule { }
