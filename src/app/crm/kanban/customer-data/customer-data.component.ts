import { Component,Input, ViewChild,Output, EventEmitter,OnChanges, SimpleChanges, AfterViewInit, input } from '@angular/core';
import { Message } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Cep, Entity, EntityContact, EntityType, EntityWeb, RepEntity } from 'src/app/models/entity.model';
import { City } from 'src/app/models/place.model';
import { EntitiesService } from 'src/app/services/entities.service';
import { ConfirmationService } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { Funnel, FunnelStage } from 'src/app/models/crm.model';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Common } from 'src/app/classes/common';
import { ResponseError } from 'src/app/models/paginate.model';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm.service';
import { SysService } from 'src/app/services/sys.service';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [ConfirmationService]
})
export class CustomerDataComponent extends Common implements OnChanges, AfterViewInit{
  //cliente que serah editado
  @Input() idEditableCustomer:number = 0;

  @Input() isVisible:boolean = false;
  isEditing:boolean = false;
  @Input() idStageOfCustomer:number = 0;
  @Output() idStageOfCustomerChange = new EventEmitter<number>();
  @Input() idCustomerFunnel:number = 0;
  customerFunnel!:Funnel|null;


  @ViewChild('pnlContact') pnlContact:OverlayPanel|null = null;
  @ViewChild('pnlWeb') pnlWeb:OverlayPanel|null = null;
  @Output() messageToShow = new EventEmitter<Message>();
  funnels:Funnel[] = [];
  representatives:Entity[] = [];
  selectedRepresentativeId:number = 0;
  sendContact:boolean = false;
  sendWeb:boolean = false;
  tabActive:number = 0;
  stages:FunnelStage[] = [];
  selectedStage:FunnelStage|null = null;

  contact_types:any = [
    {label:'E-mail',value:'E'},
    {label:'Telefone Convencional',value:'P'},
    {label:'Telefone Celular/Móvel',value:'C'},
    {label:'Facebook',value:'F'},
    {label:'Instagram',value:'I'},
    {label:'Linkedin',value:'L'},
    {label:'Outro Social',value:'O'},
    {label:'Website',value:'W'}
  ];

  editableCustomer:Entity = {
    id: 0,
    origin_id: 0,
    name: '',
    fantasy_name: '',
    taxvat: '',
    city: {
      id: 0,
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
    contacts: [],
    web: [],
    files:[],
    postal_code: '',
    neighborhood: '',
    address: '',
    type: 'C',
    date_created: undefined,
    date_updated: undefined,
    agent: null
  }

  citySuggestions:City[] = [];
  filteredCities:City[] = [];
  newContact:EntityContact = {
    id: 0,
    id_legal_entity: 0,
    name: '',
    contact_type: '',
    value: '',
    is_whatsapp: false,
    is_default: false
  }
  newWeb:EntityWeb = {
    id: 0,
    id_legal_entity: 0,
    name: '',
    web_type: '',
    value: ''
  }

  constructor(private svc:EntitiesService,
    private crm:CrmService,
    private sys:SysService,
    private confirmService:ConfirmationService,
    private localService:LocationService,
    route:Router){
      super(route);
  }

  ngAfterViewInit(): void {
    this.localService.listCities({page:1,pageSize:1,query:"can:list-all 1||is:order-by name"}).subscribe({
      next: (data) =>{
        this.citySuggestions = data as City[];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    //se estiver editando um cliente entrarah aqui pois haverao as propriedades
    if(this.isVisible){

      //realiza carga dos funis existentes
      if(changes.hasOwnProperty("isVisible")){
        this.tabActive = 0;
        this.crm.getFunnels({
          page:1,
          pageSize:1,
          query:'can:list-all 1'
        }).subscribe({
          next: (data) =>{
            this.funnels = data as Funnel[];
            this.customerFunnel = this.funnels.find(v => v.id == this.idCustomerFunnel) as Funnel;
            
            //realiza a montagem dos estagios do funil
            let evt:DropdownChangeEvent = {
              originalEvent: new Event(''),
              value: this.customerFunnel
            }
            this.getStagesOfFunnel(evt);
            //define o funil do usuario
            this.selectedStage = this.stages.find(v => v.id == this.idStageOfCustomer) as FunnelStage;
          }
        });
      }

      //realiza a carga de dados dos representantes
      this.crm.getRepresentatives({
        page:1,
        pageSize:1,
        query: "can:list_all true||is:type R||is:order_by name||is:order ASC"
      }).subscribe({
        next:(data) =>{
          this.representatives = data;
          this.representatives.unshift({
          id: 0,
          origin_id: 0,
          name: 'NÃO UTILIZAR REPRESENTANTE',
          fantasy_name: 'NÃO UTILIZAR REPRESENTANTE',
          taxvat: '',
          city: {
            id: 0,
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
          contacts: [],
          web: [],
          files:[],
          postal_code: '',
          neighborhood: '',
          address: '',
          type: '',
          date_created: undefined,
          date_updated: undefined,
          agent: null
        });
        }
      });
      
      if(changes.hasOwnProperty("idEditableCustomer")){
        //realiza a carga de dados do cliente
        this.svc.loadEntity(this.idEditableCustomer as number).subscribe({
          next: (data) =>{
            this.editableCustomer = data as Entity;
          }
        });
      }
    }else{
      this.clearData();
    }
  }

  public cityFormatedName(city:City):string{
    return city.name!="" ? city.name+'/'+city.state_region.acronym+" - "+city.state_region.country.name: "";
  }

  searchCity(evt:AutoCompleteCompleteEvent){
    if(evt.query.length>3){
      let filtered:any[] = [];
      let query = evt.query;
      for (let i = 0; i < (this.citySuggestions as City[]).length; i++) {
        let city = (this.citySuggestions as City[])[i];
        if (city.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
            filtered.push(city);
        }
      }

      this.filteredCities = filtered;
    }
  }

  saveCustomerInfo(){
    this.hasSended = true;
    if(this.editableCustomer.name.trim().length > 0 
      && this.editableCustomer.fantasy_name.trim().length > 0
      && this.editableCustomer.neighborhood.trim().length > 0
      && this.editableCustomer.postal_code.trim().length > 0
      && this.editableCustomer.city.id >0 
      && this.editableCustomer.address.trim().length > 0
      && this.idStageOfCustomer > 0){
        this.editableCustomer.type = EntityType.C;
        this.svc.saveEntity(this.editableCustomer as Entity).subscribe({
          next: (data) =>{
            if(data as number > 0){
              this.editableCustomer.id = data as number;
              this.crm.addCustomersToStage(this.selectedStage?.id as number,[this.editableCustomer]).subscribe({
                next:(data) =>{
                  this.hasSended = false;
                  if(typeof data ==='boolean' || typeof data==='number'){
                    if(typeof data ==='number'){
                      this.editableCustomer.id = data as number;
                    }
                    //nao exibe mais a mensagem por que pula para a aba de adicao de contato
                    // this.messageToShow.emit({ 
                    //   key:'systemToast',
                    //   severity:'success',
                    //   summary:'Sucesso!',
                    //   detail:'Dados do cliente salvos com sucesso.'
                    // });
                    //this.reloadData();
                    this.tabActive = 1;
                  }else{
                    this.messageToShow.emit({
                      key:'systemToast',
                      severity:'error',
                      summary:"Falha...",
                      detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details
                    })
                  }
                }
              });
            }
          },
          error: (err) => {
            this.messageToShow.emit({
              key:'systemToast',
              severity:'error',
              summary: 'Ocorreu o seguinte erro ao tentar salvar:',
              detail: err,
              life: 5000
            });
            this.hasSended = false;
          },
        });
      }
  }

  onEditContact(ct:EntityContact){
    this.newContact = ct;
  }

  onSaveContact(idContact:number){
    this.sendContact = true;
    let cts:EntityContact[] = [];
    if(idContact > 0){
      cts.push(this.editableCustomer.contacts.find(contact => contact.id==idContact) as EntityContact);
    }else{
      this.newContact.id_legal_entity = this.editableCustomer.id;
      cts.push(this.newContact);
    }
     
    this.svc.saveContacts(cts).subscribe({
      next: (data) =>{
        this.sendContact = false;
        if(typeof data ==='boolean'){
          this.newContact.id = 0;
          this.newContact.value = '';
          this.newContact.contact_type = '';
          this.newContact.is_default = false;
          this.newContact.is_whatsapp = false;
          this.newContact.name = '';
          this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Contato salvo com sucesso!'});
          this.tabActive = 1;
          this.reloadData();
        }
      },
      error: (err) => {
        this.messageToShow.emit({key:'systemToast',
          severity:'error',
          summary:'Ocorreu o seguinte erro ao tentar salvar:',
          detail: err,
          life: 5000
        });
      }
    });
  }

  verifyDefaultContact(ctId:number,type:string){
    this.editableCustomer.contacts.forEach((ct) =>{
      if (ct.id!=ctId && ct.contact_type==type){
        ct.is_default = false;
      }
    });
  }

  onDeleteContact(ct:EntityContact){
    this.confirmService.confirm({
      message: 'Deseja realmente excluir esse contado do cliente?',
      header:'Confirmação: Ação irreversível',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass:'p-button-danger',
      accept: () =>{
        let cts:EntityContact[] = [];
        cts.push(ct); 
        this.svc.deleteContacts(cts).subscribe({
          next: (data) =>{
            if(typeof data === 'boolean'){
              this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Contato excluído com sucesso!',closable:false});
              this.reloadData();
            }else{
              this.messageToShow.emit(
                {
                  key:'systemToast',
                  severity:'error',
                  summary:'Falha ao excluir!',
                  detail: (data as ResponseError).error_details
                });
            }
          }
        });
      }
    });
  }
  
  private clearData():void{
    this.editableCustomer = {
      id: 0,
      origin_id: 0,
      name: '',
      fantasy_name: '',
      taxvat: '',
      city: {
        id: 0,
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
      contacts: [],
      web: [],
      files:[],
      postal_code: '',
      neighborhood: '',
      address: '',
      type: 'C',
      date_created: undefined,
      date_updated: undefined,
      agent: null
    }

    this.customerFunnel = {
      id: 0,
      is_default: false,
      date_created: '',
      date_updated: '',
      name:'',
      stages:[],
      type:'V'
    }

    this.selectedStage = {
      id:0,
      color:'',
      date_created:'',
      date_updated:'',
      icon:'',
      icon_color: '',
      id_funnel: 0,
      name:'',
      order:0
    }

    this.newContact = {
      id: 0,
      id_legal_entity: 0,
      name: '',
      contact_type: '',
      value: '',
      is_whatsapp: false,
      is_default: false
    }
    this.newWeb = {
      id: 0,
      id_legal_entity: 0,
      name: '',
      web_type: '',
      value: ''
    }

    this.selectedRepresentativeId = 0;
    this.idEditableCustomer = 0;
    this.idStageOfCustomer = 0;

  }

  private reloadData():void{
    this.svc.loadEntity(this.editableCustomer.id).subscribe({
      next: (data) =>{
        this.editableCustomer = data as Entity;
      }
    });
  }

  getStagesOfFunnel(evt:DropdownChangeEvent){
    this.stages = evt.value.stages as FunnelStage[];
  }

  setStage(evt:DropdownChangeEvent){
    this.idStageOfCustomer = evt.value.id;
    this.idStageOfCustomerChange.emit(this.idStageOfCustomer);
  }
  
  dropFile(idFile:number){
    this.confirmService.confirm({
      message: 'Deseja realmente excluir esse arquivo do cliente?',
      header:'Confirmação: Ação irreversível',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass:'p-button-danger',
      accept: () =>{
        this.svc.deleteFile(idFile).subscribe({
          next: (data) =>{
            if(data){
              this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Arquivo excluído com sucesso!', closable:false});
            }else{
              this.messageToShow.emit({key:'systemToast',severity:'error',summary:'Falha ao excluir arquivo!', closable:false});
            }
            this.reloadData();
          }
        });
      }
    });
  }

  getPostalCode(evt:EventEmitter<any>){
    if(evt.length==8){
      this.loading = true;
      this.sys.getPostalCode(evt.toString()).subscribe({
        next: (data) =>{
          this.loading = false;
          if("address" in data){
            this.editableCustomer.address = (data as Cep).address,
            this.editableCustomer.neighborhood = (data as Cep).neighborhood,
            this.editableCustomer.city = this.citySuggestions.find(v => v.id == (data as Cep).id_city) as City;
          }else{
            this.messageToShow.emit({
              key:'systemToast',
              severity:'error',
              summary:'Falha...',
              detail: (data as ResponseError).error_details
            });
          }
        }
      });
    }
  }
}
