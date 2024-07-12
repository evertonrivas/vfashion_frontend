import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { FilterComponent } from 'src/app/common/filter/filter.component';
import { FormComponent } from 'src/app/common/form/form.component';
import { SharedModule } from 'src/app/common/shared.module';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { MeasureUnit } from 'src/app/models/measure-unit';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { MeasureUnitService } from 'src/app/services/measure-unit.service';

@Component({
  selector: 'app-measure-unit',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FilterComponent,
    FormComponent
  ],
  providers:[MessageService,ConfirmationService],
  templateUrl: './measure-unit.component.html',
  styleUrl: './measure-unit.component.scss'
})
export class MeasureUnitComponent extends Common implements AfterViewInit{
  localObject!:MeasureUnit;
  constructor(route:Router,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef,
    private svc:MeasureUnitService){
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

    this.serviceSub[1] = this.svc.list(this.options).subscribe({
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
  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];
    this.idToEdit = id;
    let fDesc:FormField = {
      label: "Descrição",
      name: "description",
      options: undefined,
      placeholder: "Digite o nome...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    };

    let fCode:FormField = {
      label: "Código",
      name: "code",
      options: undefined,
      placeholder: "Digite o código...",
      type: FieldType.INPUT,
      value: undefined,
      case: FieldCase.UPPER,
      disabled: false,
      required: true,
      lockField: undefined
    }

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.load(id).subscribe({
        next: (data) =>{
          if ("description" in data){
            this.localObject = data as MeasureUnit;
            fDesc.value = this.localObject.description;
            fCode.value = this.localObject.code;

            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fDesc,fCode]
            }
            this.formRows.push(row);
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
        fields: [fDesc,fCode]
      }  
      this.formRows.push(row);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.save(data).subscribe({
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
          ids.push((v as MeasureUnit).id);
        });
        this.serviceSub[3] = this.svc.delete(ids,pSendToTrash).subscribe({
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
