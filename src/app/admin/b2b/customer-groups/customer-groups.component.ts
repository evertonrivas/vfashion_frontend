import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { FormComponent } from 'src/app/common/form/form.component';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { EntitiesService } from 'src/app/services/entities.service';
import { CustomerGroup, Entity } from 'src/app/models/entity.model';


@Component({
    selector: 'app-customer-groups',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './customer-groups.component.html',
    styleUrl: './customer-groups.component.scss',
    imports: [
        SharedModule,
        CommonModule,
        FilterComponent,
        FormComponent
    ]
})
export class CustomerGroupsComponent extends Common implements AfterViewInit{
  localObject!:CustomerGroup;
  constructor(route:Router,
    private svc:EntitiesService,
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

    this.serviceSub[0] = this.svc.listCustomerGroup(this.options).subscribe({
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

    let opts:FieldOption[] = [];
    this.svc.listEntity({page:1,pageSize:1,query:"can:list-all 1||is:type R"}).subscribe({
      next: (data) =>{
        (data as Entity[]).forEach((e) =>{
          opts.push({
            value: e.id,
            label: e.name
          });
        });
      }
    })
    let fRepr:FormField = {
      label:"Representante",
      name:"id_representative",
      options:opts,
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required:true,
      case: FieldCase.NONE,
      disabled:false
    }

    let fApprov:FormField = {
      label: "Requer Aprovação?",
      name:"need_approvement",
      options:[{ value:0, label:'Não' },{ value:1, label:"Sim" }],
      placeholder:undefined,
      type:FieldType.RADIO,
      value:undefined,
      required:true,
      case:FieldCase.NONE,
      disabled:false
    }

    if(id>0){
      // busca os dados do registro para edicao
      this.serviceSub[1] = this.svc.loadCustomerGroup(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as CustomerGroup;
            fieldName.value = this.localObject.name;
            fApprov.value   = this.localObject.need_approvement==true?1:0;
            fRepr.value     = this.localObject.id_representative;

            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fieldName]
            }
            let row1:FormRow = {
              fields: [fRepr,fApprov]
            }
            this.formRows.push(row);
            this.formRows.push(row1);
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
        fields: [fRepr,fApprov]
      }
      this.formRows.push(row);
      this.formRows.push(row1);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[2] = this.svc.saveCustomerGroup(data).subscribe({
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
          ids.push((v as CustomerGroup).id);
        });
        this.serviceSub[3] = this.svc.deleteCustomerGroup(ids,pSendToTrash).subscribe({
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

  onEditCustomers(id:number){

  }
}
