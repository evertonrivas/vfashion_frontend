import { Component,Input,OnDestroy,Output,EventEmitter, ViewChild, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';
import { Common } from 'src/app/classes/common';
import { CalendarEvent, CalendarEventData, CalendarEventType } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { MessageService } from 'primeng/api';
import { CollectionService } from 'src/app/services/collection.service';
import { Collection } from 'src/app/models/collection.model';


@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent extends Common implements OnDestroy, AfterViewInit{
  @Input() selectedEvent:CalendarEvent | null = null;
  @Input() periodStart:string | null = null;
  @Input() periodEnd:string | null = null;
  @Input() openForm:boolean = true;
  @Output() CloseModal = new EventEmitter<boolean>;
  @ViewChild('ddet') ddet:Dropdown|null = null;

  selectedEventType:CalendarEventType|undefined = undefined;
  eventName:string = "";
  eventStart:Date|null = null;
  eventEnd:Date|null = null;
  eventBudget:number|null = null;
  eventParentEventId:number = 0;
  eventTypes:CalendarEventType[] = [];
  validPeriod:boolean = true;
  all_collections:Collection[] = [];
  selectedCollection!:Collection;

  //trabalho com children
  showParentEvents:boolean = false;
  exsistentEvents:CalendarEvent[] = [];

  constructor(private svc:CalendarService,
    private svcCol:CollectionService,
    private msgSvc:MessageService,
    route:Router){
    super(route);
  }

  ngOnDestroy(): void {
    this.serviceSub[0].unsubscribe();
    this.serviceSub[1].unsubscribe();
  }

  ngAfterViewInit(): void {
    
  }

  loadData():void{
    // realiza a carga das colecoes
    this.svcCol.list({page:1,pageSize:1,query:'can:list-all 1||'}).subscribe({
      next: (data) =>{
        this.all_collections = data as Collection[];
      }
    });

    this.validPeriod = true;

    //realiza carga dos tipos de eventos
    this.eventTypes = [];
    this.options.query = "can:list-all 1||is:just-parent 1||is:no-milestone 1||";
    this.selectedEvent?.type.id

    this.svc.listEventType(this.options).subscribe({
      next: (data) =>{
        this.eventTypes = data as CalendarEventType[];
      }
    });

    if(this.selectedEvent!=undefined){
      this.serviceSub[0] = this.svc.loadEventType(this.selectedEvent?.type.id as number).subscribe({
        next: (data) =>{
          this.selectedEventType = data as CalendarEventType;
        },
        complete: () =>{
          if(this.selectedEventType?.use_collection){
            this.selectedCollection = this.all_collections.find(v => v.id == this.selectedEvent?.collection.id) as Collection;
          }
  
          //verifica se tem orcamento e seta
          if(this.selectedEventType?.has_budget){
            this.eventBudget = this.selectedEvent?.budget_value as number;
          }
  
          this.eventName = this.selectedEvent?.name as string;
          this.eventStart = new Date(
            parseInt((this.selectedEvent?.start_date as string).substring(0,4)),
            parseInt((this.selectedEvent?.start_date as string).substring(5,7))-1,
            parseInt((this.selectedEvent?.start_date as string).substring(8,10)));
          this.eventEnd = new Date(
            parseInt((this.selectedEvent?.end_date as string).substring(0,4)),
            parseInt((this.selectedEvent?.end_date as string).substring(5,7))-1,
            parseInt((this.selectedEvent?.end_date as string).substring(8,10)));
  
          this.setSelectedEventType(this.selectedEventType as CalendarEventType);
        }
      });
    }
  }

  onSubmit():void{
    this.hasSended = true;
    let validated:boolean = true;

    //valida o basico do formulario
    if(this.eventName.trim().length == 0 || this.selectedEventType==null || this.eventStart==null || this.eventEnd==null){
      validated = false;
    }

    if (validated && (this.eventEnd as Date).getTime() < (this.eventStart as Date).getTime()){
      validated = false;
      this.validPeriod = false;
    }

    //valida o evento pai
    if(validated && (this.showParentEvents && this.eventParentEventId == 0)){
      validated = false;
    }

    //valida o budget se existe
    if(validated && ((this.selectedEventType as CalendarEventType).has_budget && this.eventBudget==0)  ){
      validated = false;
    }

    //se cria um funil, eh necessario informar a colecao
    if(validated && (this.selectedEventType as CalendarEventType).create_funnel && (this.selectedCollection == undefined || this.selectedCollection.id == 0)){
      validated = false;
      this.msgSvc.clear();
      this.msgSvc.add({
        key: 'systemToast',
        severity: 'warn',
        summary: "Atenção!!!",
        detail: "Este evento cria um novo funil no CRM, logo é necessário que ele possua uma coleção associada!"
      });
    }

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
        id_collection: (this.selectedEventType as CalendarEventType).use_collection? this.selectedCollection.id: null,
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
          this.selectedEventType = undefined;
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
    //define que nao exibirah evento pai
    this.showParentEvents = false;
    //define o evento pai como em branco
    let parentEventType:CalendarEventType = {
      id: 0,
      name: null,
      is_milestone: false,
      use_collection: false,
      has_budget: false,
      create_funnel: false,
      hex_color:"",
      children: [],
      parent:[]
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
  
    if ( selected==undefined && parentEventType!=undefined){
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
            this.exsistentEvents = data as CalendarEvent[];
          },
          complete: ()  => {
            this.eventParentEventId = (this.exsistentEvents.find(v => v.id == this.selectedEvent?.id_parent) as CalendarEvent).id;
          },
        });
      }
    }
    
    if(selected!=undefined){
      console.log("Passou aqui no selected")
      console.log(this.selectedEventType)
      // realiza a carga das colecoes
      this.svcCol.list({page:1,pageSize:1,query:'can:list-all 1||'}).subscribe({
        next: (data) =>{
          this.all_collections = data as Collection[];
        }
      });
    }
  }

  closeForm():void{
    this.exsistentEvents = [];
    this.showParentEvents = false;
    this.all_collections = [];
    this.selectedCollection = {
      id:0,
      name: "",
      brand: {
        id: 0,
        name: ""
      }
    }

    this.selectedEventType = undefined;
    this.eventName = "";
    this.eventStart = null;
    this.eventEnd = null;
    this.eventBudget = null;
    this.eventParentEventId = 0;
    this.selectedCollection = {
      id: 0,
      brand: {
        id: 0,
        name: ""
      },
      name: ""
    };
    this.eventTypes = [];
    this.validPeriod = true;


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