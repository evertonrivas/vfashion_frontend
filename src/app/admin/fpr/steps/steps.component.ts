import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { FormComponent } from 'src/app/common/form/form.component';
import { FormField } from 'src/app/models/field.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { B2bDevolutionService } from 'src/app/services/b2b.devolution.service';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { Step } from 'src/app/models/devolution.model';

@Component({
    selector: 'app-steps',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './steps.component.html',
    styleUrl: './steps.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})
export class StepsComponent extends Common implements AfterViewInit{
  localObject:Step = {
    id: 0,
    name: '',
    date_created: undefined,
    date_updated: undefined
  };
  constructor(route:Router,
    private svc: B2bDevolutionService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }
  
  ngAfterViewInit(): void {
    this.loadingData();
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

    this.serviceSub[0] = this.svc.listSteps(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];

    let fieldName:FormField = {
      label: "Nome",
      name: "name",
      options: undefined,
      placeholder: "Digine o nome...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    }
    
    let fieldFirst:FormField = {
      label:"Primeiro Passo",
      name: "first_step",
      options: [{value : 0, label : 'Não', id : undefined },{ value : 1, label : 'Sim', id : undefined }],
      placeholder: undefined,
      type: FieldType.RADIO,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    }

    let fieldNext: FormField = {
      label: "Próximo Passo",
      name: "next_step",
      options: [],
      placeholder:"Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required: false,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    }

    //define o campo que serah bloqueado no change
    //do campo atual
    fieldFirst.lockField = fieldNext;

    this.idToEdit = id;
    if(id > 0){
      this.formVisible = true;
    }else{
      this.formRows.push({
        fields: [fieldName]
      });
      this.formRows.push({
        fields:[fieldFirst,fieldNext]
      });
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveStep(data).subscribe({
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
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
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
          ids.push((v as Step).id);
        });
        this.serviceSub[3] = this.svc.deleteSteps(ids,pSendToTrash).subscribe({
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
                detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
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
