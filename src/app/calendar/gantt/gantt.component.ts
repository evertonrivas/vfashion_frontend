import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Calendar } from 'primeng/calendar';
import { Common } from 'src/app/classes/common';
import { CalendarModel, CalendarEvent, CalendarOptions } from 'src/app/models/calendar.model';
import { CalendarService } from 'src/app/services/calendar.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { FileType } from 'src/app/models/system.enum';


declare var window:any;

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./gantt.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class GanttComponent extends Common implements OnDestroy,OnInit{
  @ViewChild('dt') dt:Table|undefined;
  @ViewChild('dpp') dpp:Calendar|undefined;
  calendarEvents:CalendarEvent[] = [];
  milestones: CalendarEvent[] = [];
  selectedEvents:CalendarEvent[] = [];
  totalWeeks:number[][] = [];
  weeksOfPeriod:number = 0 ;
  showDialogEvent:boolean = false;
  showDialogMilestone:boolean = false;
  eventToEdit:CalendarEvent|null = null;
  milestoneToEdit:CalendarEvent|null = null;
  periodDates:Date[] = [];

  constructor(private svc:CalendarService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService,
    private config: PrimeNGConfig,
    route:Router){
    super(route)
    this.config.setTranslation({
      dayNamesMin:[
        'DO','SE','TE','QU','QU','SE','SA'
      ],
      monthNames: [
        'Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'
      ],
      monthNamesShort:[
        'JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'
      ]
    });

    this.options.query = "is:start ||is:end ||";
  }

  ngOnDestroy(): void {
    
  }

  formatEventDate(date:string):string{
    let d = date.split("-");
    return d[2]+"/"+d[1];
  }

  loadData():void{
    this.totalWeeks = [];
    this.calendarEvents = [];
    this.response.data = null;
    //realiza carga das informacoes do calendario (datas)

    this.serviceSub[0] = this.svc.calendarLoad(this.options).subscribe({
      next: (data) =>{
        this.response.data = data;
        this.response.data.forEach((cal:CalendarModel) => {
          if(this.totalWeeks[cal.year]==undefined){
            this.totalWeeks[cal.year] = [];
          }
          cal.months.forEach((w) =>{
            w.weeks.forEach((n) =>{
              this.totalWeeks[cal.year].push(n);
              this.weeksOfPeriod = n;
            });
          });
        });
      }
    });

    //realiza carga dos eventos
    this.serviceSub[1] = this.svc.calendarEventLoad(this.options).subscribe({
      next: (data) =>{
        this.calendarEvents = data;
      }
    });
  }

  ngOnInit(): void {
    this.calendarEvents = [];
    this.milestones = [];
    this.response.data = [];
    this.loadData();
  }

  doSearch($evt:any){
    this.dt?.filterGlobal(($evt.target as HTMLInputElement).value, 'contains');
  }

  onDeleteEvents():void{
    if (this.selectedEvents.length>0){
      this.confirmationService.confirm({
        message: 'Gostaria de remover o(s) evento(s) selecionado(s)?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        accept: () =>{
          //console.log(this.selectedEvents);
          //colocar aqui a exclusao em massa
          let evts:number[] = [];
          this.selectedEvents.forEach((evt) =>{
            evts.push(evt.id);
          });
          this.svc.calendarEventDelete(evts).subscribe({
            next: value => {
              if(value){
                this.messageService.add({
                  severity:'sucess',
                  key:'systemToast',
                  summary: 'Evento(s) excluido(s) com sucesso!',
                  closable: true,
                });
                this.loadData();
              }
            },
          });
        }
      });
    }else{
      this.confirmationService.confirm({
        message: 'Por favor selecione ao menos um evento para excluir',
        header: 'Atenção',
        icon: 'pi-pi-exclamation-triangle',
        acceptVisible: false,
        rejectLabel: 'OK',
        rejectButtonStyleClass: 'p-button-outlined',
        rejectIcon: 'pi pi-check'
      });
    }
  }

  onEvent(evt:CalendarEvent|null):void{
    this.showDialogEvent = true;
    this.eventToEdit = evt;
  }

  onMilestone(evt:CalendarEvent|null):void{
    this.showDialogMilestone = true;
    this.milestoneToEdit = evt;
  }

  onCloseModalEvent(needClose:boolean):void{
    this.showDialogEvent = !needClose;
    this.loadData();
  }

  onCloseModalMilestone(needClose:boolean):void{
    this.showDialogMilestone = !needClose;
    this.loadData();
  }

  onDateChanged():void{
    if(this.periodDates!=null){
      if(this.periodDates[1]!=null){
        this.dpp?.toggle();
        console.log(this.periodDates);
        this.options.query = "is:start "+this.periodDates[0].toISOString().substring(0,10)+"||is:end "+this.periodDates[1].toISOString().substring(0,10);
        this.loadData();
      }
    }else{
      this.options.query = "is:start ||is:end ";
      this.loadData();
    }
  }

  isCurrentWeek(weekNumber:number) {
    // Copy date so don't modify original
    let d:any = new Date();
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    let yearStart:any = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    let weekNo:number = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return weekNumber==weekNo;
  }

  exportCSV():void{
    let header:string[] = ['id','name','type','budget_value','collection','start_date','end_date','date_created','date_updated'];
    let body:string[] = [];
    let data:string = "";

    //jah monta o header de largada
    data = header.join(";")+"\n";

    this.calendarEvents.forEach((evt) =>{
      body = [];
      body.push(evt.id.toString());
      body.push(evt.name);
      body.push(evt.type.name as string);
      body.push((evt.budget_value==null?'':String(evt.budget_value)));
      body.push(evt.collection.name);
      body.push(evt.start_date);
      body.push(evt.end_date);
      body.push(evt.date_created==null?'':String(evt.date_created));
      body.push(evt.date_updated==null?'':String(evt.date_updated));
      data += body.join(";")+"\n";
      evt.children.forEach((c) =>{
        body = [];
        body.push(c.id.toString());
        body.push(c.name);
        body.push(c.type.name as string);
        body.push((c.budget_value==null?'':String(c.budget_value)));
        body.push(c.collection.name);
        body.push(c.start_date);
        body.push(c.end_date);
        body.push(c.date_created==null?'':String(c.date_created));
        body.push(c.date_updated==null?'':String(c.date_updated));
        data += body.join(";")+"\n"; 
      });
    });

    this.exportFile(data,FileType.STR);
  }

  exportJSON():void{
    this.exportFile(this.calendarEvents,FileType.JSON);
  }
}
