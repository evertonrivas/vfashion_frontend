import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { MomentService } from 'src/app/services/moment.service';
import { PaginatorState } from 'primeng/paginator';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FormComponent } from 'src/app/common/form/form.component';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { BrandService } from 'src/app/services/brand.service';
import { Brand } from 'src/app/models/brand.model';
import { Moment } from 'src/app/models/moment.model';

@Component({
    selector: 'app-moment',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './moment.component.html',
    styleUrl: './moment.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})
export class MomentComponent extends Common implements AfterViewInit, OnDestroy{
  localObject!:Moment;
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:MomentService,
    private bsvc:BrandService){
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

    this.bsvc.list({page:1,pageSize:1,query:"can:list-all 1"}).subscribe({
      next:(data) =>{
        let opts:FieldOption[] = [];
        (data as Brand[]).forEach((b) =>{
          opts.push({
            value: b.id,
            label: b.name as string,
            id:undefined
          });
        });

        this.filters.push({
          label:"Marca",
          placeholder:"Selecione...",
          type:FieldType.COMBO,
          filter_name:"brand",
          filter_prefix:"is",
          name:"brand",
          options: opts,
          value:undefined
        });
      }
    })
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
      disabled: false,
      lockField: undefined
    };
    this.idToEdit = id;

    let fieldBrand:FormField = {
      label: "Marca",
      name: "id_brand",
      options: [],
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    }

    this.serviceSub[4] = this.bsvc.list({page:1,pageSize:1,query:"can:list-all 1"}).subscribe({
      next:(data) =>{
        let opts:FieldOption[] = [];
        (data as Brand[]).forEach((b) =>{
          opts.push({
            value: b.id,
            label: b.name,
            id:undefined
          })
        });

        fieldBrand.options = opts;
      }
    });

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.load(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as Moment;
            fieldName.value  = this.localObject.name;
            fieldBrand.value = (fieldBrand.options as FieldOption[]).find(o => o.value==this.localObject.brand?.id);


            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fieldName]
            }
            let row1:FormRow = {
              fields: [fieldBrand]
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
        fields: [fieldBrand]
      }
      this.formRows.push(row);
      this.formRows.push(row1);
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
          ids.push((v as Moment).id);
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
