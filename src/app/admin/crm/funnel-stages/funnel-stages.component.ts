import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { CrmService } from 'src/app/services/crm.service';
import { TagModule } from 'primeng/tag';
import { Funnel, FunnelStage } from 'src/app/models/crm.model';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { FormComponent } from 'src/app/common/form/form.component';

@Component({
    selector: 'app-funnel-stages',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './funnel-stages.component.html',
    styleUrl: './funnel-stages.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent,
        TagModule
    ]
})
export class FunnelStagesComponent extends Common implements AfterViewInit{
  localObject!:FunnelStage;
  allOptFunnel:FieldOption[]  = [];
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:CrmService){
    super(route);
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }

  ngOnDestroy(): void {
    this.serviceSub.forEach((f) =>{
      f.unsubscribe();
    });
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

    this.serviceSub[1] = this.svc.listStages(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto da Busca",
      placeholder:"Nome ou descrição",
      type: FieldType.INPUT,
      filter_name: "search",
      filter_prefix: "is",
      name:"",
      options:undefined,
      value:undefined
    });

    this.svc.getFunnels({page:1,pageSize:1,query:'can:list-all 1'}).subscribe({
      next:(data) =>{
        let opts:FieldOption[] = [];
        (data as Funnel[]).forEach((f) =>{
          opts.push({
            value: f.id,
            label: f.name,
            id:undefined
          });
          this.allOptFunnel.push({ id: f.id, value: f.id, label: f.name});
        });

        this.filters.push({
          label: "Funil",
          placeholder:"Selecione...",
          type: FieldType.COMBO,
          filter_name:"funnel",
          filter_prefix:"is",
          name:"funnel",
          value:undefined,
          options: opts
        })
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
      placeholder: "Digite o nome...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false
    };
    let fieldFunnel:FormField = {
      label:"Funil",
      name:"id_funnel",
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: this.allOptFunnel,
      required:true,
      case:FieldCase.NONE,
      disabled:false
    }
    let fieldColor:FormField = {
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
    let fieldIcon: FormField = {
      label:"Ícone",
      name: "icon",
      options: undefined,
      placeholder: undefined,
      type: FieldType.ICON,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false
    }
    let fieldOrder:FormField = {
      label: "Ordem",
      name: "order",
      options: undefined,
      placeholder: undefined,
      type: FieldType.NUMBER,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false
    }
    this.idToEdit = id;

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.loadStage(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as FunnelStage;
            fieldName.value = this.localObject.name;
            fieldFunnel.value = fieldFunnel.options?.find(v => v.value == this.localObject.id_funnel);
            fieldColor.value = {value: this.localObject.color, label: this.localObject.color}
            fieldIcon.value = this.localObject.icon;
            fieldOrder.value = this.localObject.order;

            //monta as linhas do forme e exibe o mesmo
            this.formRows.push({ fields: [fieldName] });
            this.formRows.push({ fields: [fieldFunnel] });
            this.formRows.push({ fields: [fieldColor,fieldIcon,fieldOrder] });
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
      this.formRows.push(row);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveStages(data).subscribe({
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
          ids.push((v as FunnelStage).id);
        });
        this.serviceSub[3] = this.svc.deleteStages(ids,pSendToTrash).subscribe({
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
