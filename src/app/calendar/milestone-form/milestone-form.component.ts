import { Component, OnDestroy, AfterViewInit,Input,Output,EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/classes/common';
import { CalendarEvent, CalendarEventData, CalendarEventType } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { MessageService } from 'primeng/api';
import { RequestResponse } from 'src/app/models/paginate.model';

@Component({
  selector: 'app-milestone-form',
  templateUrl: './milestone-form.component.html',
  styleUrls: ['./milestone-form.component.scss']
})
export class MilestoneFormComponent extends Common implements AfterViewInit, OnDestroy{
  @Input() selectedEvent:CalendarEvent | null = null;
  @Input() periodStart:string | null = null;
  @Input() periodEnd:string | null = null;
  @Input() openForm:boolean = true;
  @Output() CloseModal = new EventEmitter<boolean>;
  eventTypes:CalendarEventType[] = [];
  selectedEventType:CalendarEventType;
  eventName:string="";
  selectedDate:Date|null = null;

  constructor(private svc:CalendarService,
    route:Router,
    private msgSvc:MessageService){
    super(route)

    this.selectedEventType = {
      id: 0,
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
      parent: []
    }
  }

  loadData():void{
    
    if (this.selectedEvent!=null){
      this.selectedEventType.id = this.selectedEvent.type.id;
    
      this.selectedEventType.id = this.selectedEvent.type.id;
      this.eventName = this.selectedEvent.name;
      let data = this.selectedEvent.start_date;
      this.selectedDate = new Date(parseInt(data.substring(0,4)),parseInt(data.substring(5,7))-1,parseInt(data.substring(8,10)));
    }
  }

  onSubmit():boolean{
    this.hasSended = true;
    if (this.eventName.trim() && this.selectedEventType.id!=0 && this.selectedDate!=null){
      
      // let dstart = this.selectedDate;

      let event:CalendarEventData ={
        id: this.selectedEvent?.id as number,
        id_parent: null,
        name: this.eventName,
        date_start: (this.selectedDate as Date).toISOString().substring(0,10),
        date_end:  (this.selectedDate as Date).toISOString().substring(0,10),
        budget_value: null,
        id_event_type: this.selectedEventType.id as number,
        id_collection: null,
        year: (this.selectedDate as Date).getFullYear()
      }

      this.serviceSub[1] = this.svc.calendarEventSave(event).subscribe({
        next: (data) =>{
          if(data){
            this.msgSvc.add({
              severity:'success',
              summary: 'Milestone salvo com sucesso!',
              key: 'systemToast'
            });
          }
        },
        complete: () => {
          this.selectedEventType = {
            id: 0,
            name: "",
            has_budget: false,
            hex_color: "",
            is_milestone: false,
            use_collection: false,
            children: [],
            parent:[]
          };
          this.eventName = "";
          this.selectedDate = null;
          this.hasSended = false;
          this.selectedEvent = null;
          this.CloseModal.emit(true);
        },
      });
    }
    return true;
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
  }
  
  ngAfterViewInit(): void {
    //realiza carga dos tipos de eventos
    this.options.query="is:just-parent 1||";
    this.serviceSub[0] = this.svc.eventTypeList(this.options).subscribe({
      next: (data) =>{
        ((data as RequestResponse).data as CalendarEventType[]).forEach((d)=>{
          if (d.is_milestone){
            this.eventTypes.push(d);
          }
        });
      }
    });
  }

  closeForm():void{
    this.selectedEvent = null;
    //this.frmMilestone.reset();
    this.selectedEventType = {
      id: 0,
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
      parent: []
    }
    this.eventName = "";
    this.selectedDate = null;
    this.hasSended = false;
    this.CloseModal.emit(true);
  }
}
