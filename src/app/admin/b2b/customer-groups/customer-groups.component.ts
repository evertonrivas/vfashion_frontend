import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { FormComponent } from 'src/app/common/form/form.component';
import { Options, RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { EntitiesService } from 'src/app/services/entities.service';
import { CustomerGroup, Entity } from 'src/app/models/entity.model';
import { City, StateRegion } from 'src/app/models/place.model';
import { LocationService } from 'src/app/services/location.service';

export interface filterParams{
  rule:any|undefined
  state_region: StateRegion|undefined
  password:string|undefined,
  city:City|undefined,
  user_type: any|undefined
}

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
  showCustomers:boolean = false;
  filtering:boolean = false;
  validate:boolean = false;
  sendCustomer:boolean = false;
  loadingCustomers:boolean = false;

  all_repres:Entity[] = [];

  entitiesToAddInGroup:Entity[] = [];
  selectedEntitiesToAddInGroup:Entity[] = [];
  filtersToSearch:filterParams = {
    rule: undefined,
    state_region: undefined,
    password: undefined,
    city: undefined,
    user_type: undefined
  };
  states:StateRegion[] = [];
  cities:City[] = [];
  customersInGroup:RequestResponse = {
    pagination: {
      registers: 0,
      page: 0,
      per_page: 0,
      pages: 0,
      has_next: false
    },
    data: []
  };
  constructor(route:Router,
    private svc:EntitiesService,
    private svcL:LocationService,
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
    this.svcL.listStageRegions({page:1,pageSize:1,query:'can:list-all 1||order-by acronym||order asc'}).subscribe({
      next:(data) =>{
        this.states = data as StateRegion[];
      }
    });
    this.disabledNew = true;
    this.svc.listEntity({page:1,pageSize:1,query:"can:list-all 1||is:type R"}).subscribe({
      next: (data) =>{
        this.all_repres = data as Entity[];
        this.disabledNew = false;
      }
    });
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
    this.all_repres.forEach((r) =>{
      opts.push({
        value: r.id,
        label: r.name,
        id: undefined
      });
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
      options:[{ value:0, label:'Não',id:undefined },{ value:1, label:"Sim",id:undefined }],
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
            fRepr.value     = fRepr.options?.find(v => v.value==this.localObject.id_representative);
            // console.log(fRepr.value);
            // console.log(fRepr.options);
            // console.log(this.localObject.id_representative);

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

  onEditCustomers(id:number){
    this.idToEdit = id;
    this.showCustomers = true;
  }

  clearSearch(){
    this.showCustomers = false;
  }

  getCities():void{
    this.svcL.listCities({page:1,pageSize:1,query:"can:list-all 1||is:state_region "+this.filtersToSearch.state_region?.id}).subscribe({
      next:(data) =>{
        this.cities = data as City[];
      }
    })
  }

  searchToAdd():void{
    this.filtering = true;
    let nquery:string = "can:list-all 1||is:type C||";
    if (this.filtersToSearch.city!=undefined){
      nquery += "is:id_city "+this.filtersToSearch.city.id+"||";
    }
    if (this.filtersToSearch.state_region!=undefined){
      nquery += "is:id_state_region "+this.filtersToSearch.state_region.id+"||";
    }
    this.svc.listEntity({ page:1, pageSize:1, query:nquery}).subscribe({
      next:(data) =>{
        this.filtering = false;
        this.entitiesToAddInGroup = data as Entity[];
      }
    });
  }

  cancelMassive():void{
    this.filtersToSearch = {
      city:undefined,
      password: undefined,
      rule: undefined,
      state_region: undefined,
      user_type: undefined
    }
    this.entitiesToAddInGroup = [];
    this.selectedEntitiesToAddInGroup = [];
    this.showCustomers = false;
  }

  onAddToGroup():void{
    let ids:number[] = [];
      this.selectedEntitiesToAddInGroup.forEach((u) =>{
        ids.push(u.id);
      });

      this.svc.addToCustomerGroup(this.idToEdit,{
        ids:ids
      }).subscribe({
        next:(data) =>{
          this.sendCustomer = false;
          this.msg.clear();
          if(typeof data==='boolean'){
            this.msg.add({
              severity:"success",
              summary:"Sucesso!",
              detail:"Cliente(s) adicionado(s) com sucesso!"
            });
            this.showCustomers = false;
            this.loadingData();
            this.cancelMassive();
          }else{
            this.msg.add({
              key: 'systemToast',
              severity: 'error',
              summary: 'Ocorreu o seguinte erro no sistema!',
              detail: (data as ResponseError).error_details
            });
          }
        }
      });
  }

  onViewCustomers(evt:PaginatorState = { page: 0, pageCount: 0},id:number){
    if (id > 0){
      this.loadingCustomers = true;
      let options:Options = {
        query : "is:id_group "+id.toString(),
        page: (evt.page as number)+1,
        pageSize: this.sysconfig.system.pageSize
      }

      this.serviceSub[2] = this.svc.listCustomerGroupCustomers(options).subscribe({
        next: (data) =>{
          this.customersInGroup = data as RequestResponse;
          this.cdr.detectChanges();
          this.loadingCustomers = false;
        }
      });
    }
  }

  onHideCustomers(){
    this.customersInGroup = {
      pagination: {
        has_next: false,
        page: 0,
        pages: 0,
        per_page: this.sysconfig.system.pageSize,
        registers: 0
      },
      data: []
    }
  }
}
