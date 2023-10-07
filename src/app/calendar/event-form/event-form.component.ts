import { Component,Input,OnDestroy,Output,EventEmitter, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { Common } from 'src/app/classes/common';
import { CalendarEvent, CalendarEventData, CalendarEventType, EventTypeOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends Common implements OnDestroy{
  @Input() selectedEvent:CalendarEvent | null = null;
  @Input() periodStart:string | null = null;
  @Input() periodEnd:string | null = null;
  @Input() openForm:boolean = true;
  @Output() CloseModal = new EventEmitter<boolean>;
  @ViewChild('ddet') ddet:Dropdown|null = null;

  selectedEventType:CalendarEventType|null = null;
  eventName:string = "";
  eventStart:Date|null = null;
  eventEnd:Date|null = null;
  eventBudget:number|null = null;
  eventParentEventId:number = 0;
  eventCollectionId:number = 0;
  eventTypes:CalendarEventType[] = [];
  validPeriod:boolean = true;

  //trabalho com children
  showParentEvents:boolean = false;
  exsistentEvents:CalendarEvent[] = [];

  constructor(private svc:CalendarService,
    route:Router,
    private msgSvc:MessageService){
    super(route);

    this.selectedEventType = {
      id: 0,
      name: "",
      has_budget: false,
      hex_color: "",
      is_milestone: false,
      use_collection: false,
      children: [],
    }
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
  }

  loadData():void{
    this.validPeriod = true;

    //realiza carga dos tipos de eventos
    this.eventTypes = [];
    this.serviceSub[0] = this.svc.eventTypeList(this.options).subscribe({
      next: (data) =>{
        (data as CalendarEventType[]).forEach((evtt) =>{
          if (evtt.is_milestone==false)
            this.eventTypes.push(evtt);
        });
      },complete: () => {
          if(this.selectedEvent!=null){

            //tratamento para tipo de evento
            if(this.ddet!=null){
              this.selectedEventType = this.selectedEvent.type;
              this.ddet.selectItem(new Event(''),this.selectedEventType);
              this.ddet.onChange.emit();
            }

            //tratamento para valor do orcamento
            if (this.selectedEvent.budget_value!=null){
              this.eventBudget = this.selectedEvent.budget_value;
            }
      
            //nome
            this.eventName = this.selectedEvent.name;
            this.eventStart = new Date(parseInt(this.selectedEvent.start_date.substring(0,4)),parseInt(this.selectedEvent.start_date.substring(5,7))-1,parseInt(this.selectedEvent.start_date.substring(8,10)));
            this.eventEnd = new Date(parseInt(this.selectedEvent.end_date.substring(0,4)),parseInt(this.selectedEvent.end_date.substring(5,7))-1,parseInt(this.selectedEvent.end_date.substring(8,10)));
          }
      },
    });
  }

  onSubmit():void{
    this.hasSended = true;
    let validated:boolean = true;

    //valida o basico do formulario
    if(this.eventName.trim().length == 0 || this.selectedEventType==null || this.eventStart==null || this.eventEnd==null){
      validated = false;
      console.log("No comeco");
    }

    if (validated && (this.eventEnd as Date).getTime() < (this.eventStart as Date).getTime()){
      validated = false;
      this.validPeriod = false;
      console.log("entrou nas porra das datas") 
    }

    //valida o evento pai
    if(validated && (this.showParentEvents && this.eventParentEventId == 0)){
      validated = false;
      console.log("No evento pai");
    }

    //valida o budget se existe
    if(validated && ((this.selectedEventType as CalendarEventType).has_budget && this.eventBudget==0)  ){
      validated = false;
      console.log("No budget");
    }

    console.log(validated);
    console.log(this.validPeriod);

    //colocar aqui a validacao
    if (validated){

      let event:CalendarEventData = {
        id: (this.selectedEvent?.id as number) >0 ? (this.selectedEvent?.id as number): 0,
        id_parent: this.eventParentEventId,
        name: this.eventName,
        date_start: (this.eventStart as Date).toISOString().substring(0,10),
        date_end: (this.eventEnd as Date).toISOString().substring(0,10),
        budget_value: (this.selectedEventType as CalendarEventType).has_budget ? this.eventBudget: null,
        id_event_type: (this.selectedEventType as CalendarEventType).id,
        id_collection: (this.selectedEventType as CalendarEventType).use_collection? this.eventCollectionId: null,
        year: 0
      };

      this.serviceSub[1] = this.svc.calendarEventSave(event).subscribe({
        next: (data) =>{
          if (data){
            this.msgSvc.add({
              severity:'success',
              summary:'Evento salvo com sucesso!',
              key: 'systemToast'
            });
          }
        },
        complete: () =>{
          this.selectedEvent = null;
          this.selectedEventType = null;
          this.hasSended = this.validPeriod = false;
          this.showParentEvents = false;
          this.selectedEvent = null;
          this.eventParentEventId = 0;
          this.CloseModal.emit(true);
        }
      });
    }
  }

  onChangeType():void{
    this.showParentEvents = false;
    let parentEventType:CalendarEventType = {
      id: 0,
      name: null,
      is_milestone: false,
      use_collection: false,
      has_budget: false,
      hex_color:"",
      children: []
    };

    //busca em tipos de eventos
    let selected = this.eventTypes.find((v) =>{
      return (this.selectedEventType!=null)?v.id==this.selectedEventType.id:undefined
    });

    //busca em tipos de eventos filhos
    if (selected==undefined){
      this.eventTypes.find((evt) =>{
        selected = evt.children.find((v:any) =>{
          if(this.selectedEventType!=null){
            if (v.id==this.selectedEventType.id){
              parentEventType = evt;
            }
            return v;
          }
          return undefined;
        });
      });
    }
  
    if ( selected!==undefined){

      if (parseInt(parentEventType.id.toString()) > 0){
        this.showParentEvents = true;
        //realizar aqui a carga de dados dos eventos conforme o tipo do evento pai
        let dt_start = '';
        let dt_end   = '';
        this.svc.calendarEventLoad({
          query: 'is:start ' + dt_start + '||is:end ' + dt_end + '||is:event-type ' + parentEventType.id.toString(),
          page: 1,
          pageSize: 1
        }).subscribe({
          next: (data) =>{
            this.exsistentEvents = data;
          },
          complete: ()  => {
            this.eventParentEventId = parentEventType.id
          },
        });
      }
    }
  }

  closeForm():void{
    this.exsistentEvents = [];
    this.showParentEvents = false;
    this.CloseModal.emit(true);
  }

  setSelectedEventType(evt:CalendarEventType){
    this.selectedEventType = evt;
    if(this.ddet!=null){
      this.ddet.placeholder = evt.name as string;
      this.ddet.hide();
      this.ddet.onChange.emit();
    }
  }

  resetPlaceHolder(){
    if(this.ddet!=null){
      this.ddet.placeholder = "Seleção de Evento..."
    }
  }
}