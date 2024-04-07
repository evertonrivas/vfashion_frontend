import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { CalendarService } from 'src/app/services/calendar.service';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { TagModule } from 'primeng/tag';
import { SysService } from 'src/app/services/sys.service';
import { FormComponent } from 'src/app/common/form/form.component';
import { CalendarEventType } from 'src/app/models/calendar.model';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { PaginatorState } from 'primeng/paginator';

@Component({
    selector: 'app-event-types',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './event-types.component.html',
    styleUrl: './event-types.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent,
        TagModule
    ]
})
export class EventTypesComponent extends Common implements AfterViewInit{
  localObject!:CalendarEventType;
  constructor(route:Router,
    private svc:CalendarService,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private ssvc:SysService){
    super(route);
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    //se nao existe trash no query
    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("trash 1||","");
      }
    }

    this.svc.listEventType(this.options).subscribe({
      next:(data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{

  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];
    this.idToEdit = id;

    let fieldName:FormField = {
      label: "Nome",
      name: "name",
      options: undefined,
      placeholder: "Digite o nome...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false
    };

    let fColor:FormField = {
      label: "Cor",
      name: "hex_color",
      options: undefined,
      placeholder: "Selecione...",
      type:FieldType.KCOLOR,
      value: undefined,
      required:true,
      case: FieldCase.NONE,
      disabled:false
    }

    let fBudget:FormField = {
      label: "Faz orçamento",
      name: "has_budget",
      options: [{ value: 0, label:'Não' },{ value:1, label:'Sim' }],
      placeholder: undefined,
      type: FieldType.RADIO,
      value: undefined,
      required:true,
      case: FieldCase.NONE,
      disabled:false
    }

    let fCollection:FormField = {
      label: "Controla Coleção",
      name: "use_collection",
      options: [{ value: 0, label:'Não'},{ value:1, label:'Sim' }],
      placeholder: undefined,
      type:FieldType.RADIO,
      value:undefined,
      required:true,
      case: FieldCase.NONE,
      disabled: false
    }

    let fMilestone:FormField = {
      label: "É marco (milestone)?",
      name: "is_milestone",
      options: [{ value: 0, label:'Não' },{ value:1, label:'Sim' }],
      placeholder: undefined,
      type: FieldType.RADIO,
      value: undefined,
      required:true,
      case: FieldCase.NONE,
      disabled:false
    }

    if(id>0){
      // busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.loadEventType(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject  = data as CalendarEventType;
            fieldName.value   = this.localObject.name;
            fBudget.value     = this.localObject.has_budget;
            fCollection.value = this.localObject.use_collection;
            fMilestone.value  = this.localObject.is_milestone;
            fColor.value      = {value: this.localObject.hex_color, label: this.localObject.hex_color}
            //{value: '#FFFFBA', label: '#FFFFBA'}

            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fieldName]
            }
            let row1:FormRow = {
              fields: [fColor]
            }
            let row2:FormRow = {
              fields: [fBudget,fCollection,fMilestone]
            }
            this.formRows.push(row);
            this.formRows.push(row1);
            this.formRows.push(row2);
            this.formVisible = true;
            
          }else{
            this.msg.clear();
            this.msg.add({
              summary:"Falha...",
              detail: "Ocorreu um erro ao tentar carregar o registro",
              severity:"error"
            });
          }
        }
      });
    }else{
      //monta as linhas do forme e exibe o mesmo
      let row:FormRow = {
        fields: [fieldName]
      }
      let row1:FormRow = {
        fields: [fColor]
      }
      let row2:FormRow = {
        fields: [fBudget,fCollection,fMilestone]
      }
      this.formRows.push(row);
      this.formRows.push(row1);
      this.formRows.push(row2);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveEventType(data).subscribe({
      next:(data) =>{
        this.hasSended = false;
        this.formVisible = false;
        this.msg.clear();
        if(typeof data ==='number'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro criado com sucesso!",
            severity:"success"
          });
        }else if(typeof data ==='boolean'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro atualizado com sucesso!",
            severity:"success"
          });
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
            severity:"error"
          });
        }
        this.loadingData();
      }
    });
  }

  onDataDelete(pSendToTrash:boolean):void{
    this.cnf.confirm({
      header:"Confirmação de "+(pSendToTrash==true?"exclusão":"restauração"),
      message:"Deseja realmente "+(pSendToTrash==true?"excluir":"restaurar")+" o(s) registro(s) marcado(s)?",
      acceptLabel:"Sim",
      acceptIcon:"pi pi-check mr-1",
      acceptButtonStyleClass:"p-button-sm",
      accept:() =>{
        let ids:number[] = [];
        this.tableSelected.forEach((v) =>{
          ids.push((v as CalendarEventType).id);
        });
        this.serviceSub[3] = this.svc.deleteEventType(ids,pSendToTrash).subscribe({
          next: (data) =>{
            this.msg.clear();
            //carrega com base no botao de lixeira
            this.loadingData({page:0,pageCount:0},this.isTrash);
            //limpa os registros selecionados
            this.tableSelected = [];
            if (typeof data ==='boolean'){
              this.msg.add({
                severity:"success",
                summary:"Sucesso!",
                detail:"Registro(s) "+(pSendToTrash==true?"excluído":"restaurado")+"(s) com sucesso!"
              });
            }else{
              this.msg.add({
                summary:"Falha...",
                detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
                severity:"error"
              });
            }
          }
        });
      },
      rejectLabel:"Não",
      rejectIcon:"pi pi-ban mr-1",
      rejectButtonStyleClass:"p-button-danger p-button-sm"
    });
  }
}
