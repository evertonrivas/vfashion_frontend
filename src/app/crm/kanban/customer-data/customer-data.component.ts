import { Component,Input, ViewChild,Output, EventEmitter,OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { Message } from 'primeng/api';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { Entity, EntityContact, EntityType, EntityWeb, RepEntity } from 'src/app/models/entity.model';
import { City } from 'src/app/models/place.model';
import { EntitiesService } from 'src/app/services/entities.service';
import { ConfirmationService } from 'primeng/api';
import { LocationService } from 'src/app/services/location.service';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { Funnel, FunnelStage } from 'src/app/models/crm.model';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Common } from 'src/app/classes/common';
import { Options } from 'src/app/models/paginate.model';
import { Router } from '@angular/router';
import { CrmService } from 'src/app/services/crm.service';

@Component({
  selector: 'app-customer-data',
  templateUrl: './customer-data.component.html',
  styleUrls: ['./customer-data.component.scss'],
  providers: [ConfirmationService]
})
export class CustomerDataComponent extends Common implements OnChanges, AfterViewInit{
  @Input() isVisible:boolean = false;
  @Input() isEditing:boolean = false;
  @Input() representatives:Entity[] = [];
  @Input() funnels:Funnel[] = [];
  @ViewChild('cmplCity') cmplCity:AutoComplete|null = null;
  @ViewChild('ddRep') ddRep:Dropdown|null = null;
  @ViewChild('pnlContact') pnlContact:OverlayPanel|null = null;
  @ViewChild('pnlWeb') pnlWeb:OverlayPanel|null = null;
  @Output() messageToShow = new EventEmitter<Message>();
  selectedRepresentativeId:number = 0;
  sendContact:boolean = false;
  sendWeb:boolean = false;
  tabActive:number = 0;
  stages:FunnelStage[] = [];
  selectedFunnel:Funnel|null = null;
  selectedStage:FunnelStage|null = null;

  @Input() editableCustomer:Entity = {
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
    private confirmService:ConfirmationService,
    private localService:LocationService,
    route:Router){
      super(route);
  }
  ngAfterViewInit(): void {
    let opt:Options = {
      page:1,
      pageSize:0,
      query:"can:list_all true"
    };
    this.localService.listCities(opt).subscribe({
      next: (data) =>{
        this.citySuggestions = data as City[];
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty("editableCustomer") && this.editableCustomer.agent!=null){
      //console.log(this.editableCustomer.agent);
      this.selectedRepresentativeId = this.editableCustomer.agent.id;
        // (this.ddRep as Dropdown).onChange.emit();
    }
    if(!this.isVisible){
      this.selectedRepresentativeId = 0;
      this.newWeb = {
        id: 0,
        id_legal_entity: 0,
        name: '',
        web_type: '',
        value: ''
      };

      this.newContact = {
        id: 0,
        id_legal_entity: 0,
        name: '',
        contact_type: '',
        value: '',
        is_whatsapp: false,
        is_default: false
      };

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
      };

      this.hasSended = this.sendContact = this.sendWeb = false;
      this.tabActive = 0;
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
      && this.editableCustomer.address.trim().length > 0){
        this.editableCustomer.type = EntityType.C;
        this.svc.saveEntity(this.editableCustomer as Entity).subscribe({
          next: (data) =>{
            if(data as number > 0){
              this.editableCustomer.id = data as number;
              this.crm.addCustomersToStage(this.selectedStage?.id as number,[this.editableCustomer]).subscribe({
                next:(data) =>{
                  if(typeof data ==='boolean'){
                    this.messageToShow.emit({ key:'systemToast',severity:'success',summary:'Dados do cliente salvos com sucesso!'});
                    this.hasSended = false;
                    this.reloadData();
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

  saveNewCustomerContact(idCustomer:number){
    this.sendContact = true;
    let cts:EntityContact[] = [];
    this.newContact.id_legal_entity = idCustomer;
    cts.push(this.newContact);

    if (this.newContact.name.trim().length!=0 && this.newContact.value.trim().length!=0){
      this.svc.saveContacts(cts).subscribe({
        next: (data) =>{
          if(data){
            this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Novo contato salvo com sucesso!'});
            this.sendContact = false;
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
          this.sendContact = false;
        }
      });
    }
  }

  saveNewCustomerWeb(idCustomer:number){
    this.sendWeb = true;
    let wbs:EntityWeb[] = [];
    this.newWeb.id_legal_entity = idCustomer;
    wbs.push(this.newWeb);
    

    if (this.newWeb.name.trim().length!=0 && this.newWeb.value.trim().length!=0){
      this.svc.saveWebs(wbs).subscribe({
        next: (data) =>{
          if(data){
            this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Novo endereço web salvo com sucesso!'});
            this.sendWeb = false;
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
          this.sendWeb = false;
        }
      });
    }
  }

  saveCustomerContact(idContact:number){
    this.sendContact = true;
    let cts:EntityContact[] = [];
    cts.push(this.editableCustomer.contacts.find(contact => contact.id==idContact) as EntityContact);
     
    this.svc.saveContacts(cts).subscribe({
      next: (data) =>{
        if(data){
          this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Contato salvo com sucesso!'});
          this.sendContact = false;
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
        this.sendContact = false;
      }
    });
  }

  saveCustomerContacts(){
    this.sendContact = true;
    this.svc.saveContacts((this.editableCustomer as Entity).contacts).subscribe({
      next: (data) =>{
        if(data){
          this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Contatos salvos com sucesso!'});
          this.sendContact = false;
          this.reloadData();
        }
      },
      error: (err) =>{
        this.messageToShow.emit({
          key:'systemToast',
          severity:'error',
          summary:'Ocorreu o seguinte erro ao tentar salvar:',
          detail:err,
          life: 5000
        });
        this.sendContact = false;
      },
    });
  }

  saveCustomerWeb(webId:number){
    this.sendWeb = true;
    let wbs:EntityWeb[] = [];
    wbs.push(this.editableCustomer.web.find(web => web.id==webId) as EntityWeb);
    this.svc.saveWebs(wbs).subscribe({
      next: (data) =>{
        if(data){
          this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Informação web salva com sucesso!'});
          this.sendWeb = false;
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
        this.sendWeb = false;
      },
    });
  }

  saveCustomerWebs(){
    this.sendWeb = true;
    this.svc.saveWebs((this.editableCustomer as Entity).web).subscribe({
      next: (data) =>{
        if(data){
          this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Informações web salvas com sucesso!'});
          this.sendWeb = false;
          this.reloadData();
        }
      },
      error: (err) =>{
        this.messageToShow.emit({
          key:'systemToast',
          severity:'error',
          summary:'Ocorreu o seguinte erro ao tentar salvar:',
          detail:err,
          life: 5000
        });
        this.sendWeb = false;
      },
    });
  }

  verifyDefaultContact(ctId:number,type:string){
    this.editableCustomer.contacts.forEach((ct) =>{
      if (ct.id!=ctId && ct.contact_type==type){
        ct.is_default = false;
      }
    });
  }

  verifyDeleteContact(ct:EntityContact){
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
            this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Contato excluído com sucesso!'});
            this.reloadData();
          }
        });
      }
    });
  }

  verifyDeleteWeb(wb:EntityWeb){
    this.confirmService.confirm({
      message:'Deseja realmente excluir esse endereço web do cliente?',
      header:'Confirmação: Ação irreversível',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:'Sim',
      rejectLabel: 'Não',
      rejectButtonStyleClass:'p-button-danger',
      accept: () =>{
        let wbs:EntityWeb[] = [];
        wbs.push(wb); 
        this.svc.deleteWebs(wbs).subscribe({
          next: (data) =>{
            this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Endereço web excluído com sucesso!'});
            this.reloadData();
          }
        });
      }
    });
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

  addContactInNewCustomer(){
    this.sendContact = true;
    if (this.newContact.name.trim().length > 0 &&
      this.newContact.value.trim().length > 0){
      let ct = this.newContact;
      this.editableCustomer.contacts.push(ct);
      this.newContact = {
        id: 0,
        id_legal_entity: 0,
        name: '',
        contact_type: '',
        value: '',
        is_whatsapp: false,
        is_default: false
      }
      this.pnlContact?.toggle(new Event(''));
      this.sendContact = false;
    }
  }

  addWebInNewCustomer(){
    this.sendWeb = true;
    if (this.newWeb.name.trim().length > 0 &&
    this.newWeb.value.trim().length > 0){
      this.editableCustomer.web.push(this.newWeb);
      this.newWeb = {
        id: 0,
        id_legal_entity: 0,
        name: '',
        web_type: '',
        value: ''
      }
      this.pnlWeb?.toggle(new Event(''));
      this.sendWeb = false;
    }
  }

  removeContactFromNewCustomer(ct:EntityContact){
    this.editableCustomer.contacts.forEach((cont,idx) =>{
      if (ct==cont){
        this.editableCustomer.contacts.splice(idx,1);
      }
    });
  }

  removeWebFromNewCustomer(wb:EntityWeb){
    this.editableCustomer.web.forEach((ent,idx) =>{
      if (wb==ent){
        this.editableCustomer.web.splice(idx,1);
      }
    });
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
              this.messageToShow.emit({key:'systemToast',severity:'success',summary:'Arquivo excluído com sucesso!'});
            }else{
              this.messageToShow.emit({key:'systemToast',severity:'error',summary:'Falha ao excluir arquivo!'});
            }

            this.reloadData();
          }
        });
      }
    });
  }
}
