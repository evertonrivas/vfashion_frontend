import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { SharedModule } from '../common/shared.module';
import { SplitterModule } from 'primeng/splitter';
import { EventComponent } from './event/event.component';
import { MilestoneFormComponent } from './milestone-form/milestone-form.component';
import { FormsModule } from '@angular/forms';
import { EventFormComponent } from './event-form/event-form.component';
import { GanttComponent } from './gantt/gantt.component';
import { CalendarModule as PCalendarModule } from 'primeng/calendar';
import { CascadeSelectModule } from 'primeng/cascadeselect';
import { FlimvComponent } from './flimv/flimv.component';
import { SliderModule } from 'primeng/slider';
import { TopbarComponent } from '../common/topbar/topbar.component';

@NgModule({
  declarations: [
    CalendarComponent,
    EventComponent,
    MilestoneFormComponent,
    EventFormComponent,
    GanttComponent,
    FlimvComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    SharedModule,
    SplitterModule,
    FormsModule, 
    PCalendarModule,
    CascadeSelectModule,
    SliderModule,
    TopbarComponent
  ]
})
export class CalendarModule { }
