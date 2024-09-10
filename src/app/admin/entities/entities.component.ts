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
import { FieldCase, FieldType, FileType } from 'src/app/models/system.enum';
import { FormComponent } from 'src/app/common/form/form.component';
import { Entity } from 'src/app/models/entity.model';
import { FieldOption, FormField } from 'src/app/models/field.model';
import { LocationService } from 'src/app/services/location.service';
import { City, Country, StateRegion } from 'src/app/models/place.model';
import { FileUploadModule } from 'primeng/fileupload';
import { HttpHeaders } from '@angular/common/http';

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
        FormComponent,
        FileUploadModule
    ]
})

export class EntitiesComponent extends Common implements AfterViewInit{
  localObject!:Entity;
  url_upload_import:string = this.envconfig.backend_cmm+'/upload/import/?type=E';
  showDialogImport:boolean = false;
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));
  all_cities:FieldOption[] = [];
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

    this.all_cities = [];
    this.lsvc.listCities({page:1,pageSize:1,query:"can:list-all 1||is:order-by name"}).subscribe({
      next: (data) =>{
        (data as City[]).forEach(c =>{
          this.all_cities.push({ id:c.id,label:c.name,value:c.id });
        });
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
      options:[{value:'C',label:'Cliente',id:undefined},{value:'R',label:'Representante',id:undefined},{value:'S',label:'Fornecedor',id:undefined},{value:'P',label: 'Pessoa (Física)', id:undefined}],
      value:undefined
    });

    //primeiro buscar pais e dentro do pais buscar estado
    let cOpt:FieldOption[] = [];
    this.lsvc.listCountries({ page:1, pageSize:1, query:'can:list-all 1'}).subscribe({
      next:(data) =>{
        (data as Country[]).forEach((c) =>{
          cOpt.push({
            value: c.id,
            label: c.name,
            id:undefined
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
            label: s.acronym+" - "+s.name,
            id:undefined
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
    this.idToEdit = id;

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
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    };

    let fieldFantasy:FormField = {
      label: "Nome Fantasia ou apelido",
      name: "fantasy_name",
      options: undefined,
      placeholder: "Digite o nome fantasia ou apelido...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    }

    let fieldTaxvat:FormField = {
      label: "CPF/CNPJ",
      name: "taxvat",
      options: undefined,
      placeholder: "Digite o CPF ou CNPJ...",
      type: FieldType.TAXVAT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    }

    let fieldAddress:FormField = {
      label: "Endereço",
      name: "address",
      options: undefined,
      placeholder: "Digite o endereço...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    }

    let fieldBairro:FormField = {
      label: "Bairro",
      name: "neighborhood",
      options: undefined,
      placeholder: "Digite o bairro...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField: undefined
    }
    
    let fieldCity:FormField = {
      label: "Cidade",
      name: "city",
      options: this.all_cities,
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    }

    let fieldCEP:FormField = {
      label: 'CEP',
      name: 'postal_code',
      options: undefined,
      placeholder:undefined,
      type: FieldType.POSTAL_CODE,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined,
      dependent:[fieldAddress,fieldBairro,fieldCity]
    }

    let levelOpts:FieldOption[] = []
    levelOpts.push({id:0,label:'Cliente',value:'C'});
    levelOpts.push({id:0,label:'Fornecedor',value:'F'});
    levelOpts.push({id:0,label:'Pessoa (física)',value:'P'});
    levelOpts.push({id:0,label:'Representante',value:'R'});

    let fieldType:FormField = {
      label: 'Tipo',
      name: 'type',
      options: levelOpts,
      placeholder:"Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    }

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.loadEntity(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject   = data as Entity;
            fieldName.value    = this.localObject.name;
            fieldFantasy.value = this.localObject.fantasy_name;
            fieldBairro.value  = this.localObject.neighborhood;
            fieldAddress.value = this.localObject.address;
            fieldCEP.value     = this.localObject.postal_code;
            fieldTaxvat.value  = this.localObject.taxvat;
            fieldCity.value    = this.all_cities.find(f => f.id == this.localObject.city.id);
            fieldType.value    = levelOpts.find(f => f.value == this.localObject.type );

            //monta as linhas do forme e exibe o mesmo
            this.formRows.push({ fields: [fieldName]});
            this.formRows.push({ fields: [fieldFantasy,fieldTaxvat]});
            this.formRows.push({ fields: [fieldCEP,fieldAddress,fieldBairro]});
            this.formRows.push({ fields: [fieldCity,fieldType]});
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
      this.formRows.push({ fields: [fieldName]});
      this.formRows.push({ fields: [fieldFantasy,fieldTaxvat]});
      this.formRows.push({ fields: [fieldCEP,fieldAddress,fieldBairro]});
      this.formRows.push({ fields: [fieldCity,fieldType]});
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    let entity:Entity = {
      id: data.id,
      origin_id: 0,
      name: data.name,
      fantasy_name: data.fantasy_name,
      taxvat: data.taxvat,
      city: {
        id: data.city,
        state_region: {
          id: 0,
          country: {
            id: 0,
            name: ''
          },
          name: '',
          acronym: ''
        },
        name: '',
        brazil_ibge_code: null
      },
      agent: null,
      contacts: [],
      web: [],
      files: [],
      postal_code: data.postal_code,
      neighborhood: data.neighborhood,
      address: data.address,
      type: data.type,
      date_created: undefined,
      date_updated: undefined
    }
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveEntity(entity).subscribe({
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

  onImport():void{
    this.showDialogImport = true;
  }

  cancelImport():void{
    this.showDialogImport = false;
  }

  uploadDone():void{
    this.svc.processImport().subscribe({
      next: (data) =>{
        this.msg.clear();
        if(typeof data ==='boolean'){
          this.msg.add({
            severity:"success",
            summary:"Sucesso!",
            detail:"Importação de dados em processamento!"
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
  }
}
