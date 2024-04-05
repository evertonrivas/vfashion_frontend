import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { EntitiesService } from 'src/app/services/entities.service';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FormComponent } from 'src/app/common/form/form.component';
import { Entity } from 'src/app/models/entity.model';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { LocationService } from 'src/app/services/location.service';
import { Country, StateRegion } from 'src/app/models/place.model';

@Component({
    selector: 'app-entities',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './entities.component.html',
    styleUrl: './entities.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})

export class EntitiesComponent extends Common implements AfterViewInit{
  localObject!:Entity;
  constructor(route:Router,
    private svc:EntitiesService,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private lsvc:LocationService){
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

    this.serviceSub[0] = this.svc.listEntity(this.options).subscribe({
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
      placeholder:"CPF/CNPJ, Razão Social, Fantasia, Endereço, Estado, Cidade, Bairro",
      type: FieldType.INPUT,
      filter_name: "search",
      filter_prefix: "is",
      name:"search",
      options:undefined,
      value:undefined
    });
    
    this.filters.push({
      label:"Tipo",
      placeholder:"Selecione...",
      type: FieldType.COMBO,
      filter_name: "type",
      filter_prefix: "is",
      name:"type",
      options:[{value:'C',label:'Cliente'},{value:'R',label:'Representante'},{value:'S',label:'Fornecedor'}],
      value:undefined
    });

    //primeiro buscar pais e dentro do pais buscar estado
    let cOpt:FieldOption[] = [];
    this.lsvc.listCountries({ page:1, pageSize:1, query:'can:list-all 1'}).subscribe({
      next:(data) =>{
        (data as Country[]).forEach((c) =>{
          cOpt.push({
            value: c.id,
            label: c.name
          });
        });

        this.filters.push({
          label:"País",
          placeholder:"Selecione...",
          type:FieldType.COMBO,
          filter_name: "id_country",
          filter_prefix: "is",
          name:"country",
          options: cOpt,
          value: undefined
        });

        this.loadStateRegion();
      }
    });
  }

  loadStateRegion(idCountry:number = 0):void{
    let sOpt:FieldOption[] = [];
    this.lsvc.listStageRegions({ page:1, pageSize:1 , query:'can:list-all 1||is:order-by acronym||is:order asc'+(idCountry>0?"||id_country "+idCountry.toString():"") }).subscribe({
      next:(data) =>{
        (data as StateRegion[]).forEach((s) =>{
          sOpt.push({
            value: s.id,
            label: s.acronym+" - "+s.name
          });
        });

        this.filters.push({
          label:"Estado",
          placeholder: "Selecione...",
          type: FieldType.COMBO,
          filter_name: "id_state_region",
          filter_prefix:"is",
          name:"state_region",
          options: sOpt,
          value: undefined
        });
      }
    });
  }

  onEditData(id:number = 0):void{

    //produzir formulario proprio adequado, ou transformar o do CRM em common


    // //limpa o formulario
    // this.formRows = [];
    // let fieldName:FormField = {
    //   label: "Nome",
    //   name: "name",
    //   options: undefined,
    //   placeholder: "Digite o nome...",
    //   type: FieldType.INPUT,
    //   value: undefined,
    //   required: true,
    //   case: FieldCase.UPPER,
    //   disabled: false
    // };
    // this.idToEdit = id;

    // if(id>0){
    //   //busca os dados do registro para edicao
    //   this.serviceSub[2] = this.svc.loadEntity(id).subscribe({
    //     next: (data) =>{
    //       if ("name" in data){
    //         this.localObject = data as Entity;
    //         fieldName.value = this.localObject.name;

    //         //monta as linhas do forme e exibe o mesmo
    //         let row:FormRow = {
    //           fields: [fieldName]
    //         }
    //         this.formRows.push(row);
    //         this.formVisible = true;
            
    //       }else{
    //         this.msg.clear();
    //         this.msg.add({
    //           summary:"Falha...",
    //           detail: "Ocorreu um erro ao tentar carregar o registro",
    //           severity:"error"
    //         });
    //       }
    //     }
    //   });
    // }else{
    //   //monta as linhas do forme e exibe o mesmo
    //   let row:FormRow = {
    //     fields: [fieldName]
    //   }  
    //   this.formRows.push(row);
    //   this.formVisible = true;
    // }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveEntity(data as Entity).subscribe({
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
          ids.push((v as Entity).id);
        });
        this.serviceSub[3] = this.svc.deleteEntity(ids,pSendToTrash).subscribe({
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
