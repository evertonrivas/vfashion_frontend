import { Component,AfterContentInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/classes/common';
import { CrmService } from 'src/app/services/crm.service';
import { ConfirmationService, MenuItem, Message, MessageService } from 'primeng/api';
import { Funnel, FunnelStage } from 'src/app/models/crm.model';
import { DataOrder, DataSearch } from 'src/app/models/system.enum';
import { Entity, EntityContact, EntityNotification, EntityWeb } from 'src/app/models/entity.model';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { Checkbox } from 'src/app/models/checkbox.model';
import { HttpHeaders } from '@angular/common/http';
import { CustomerEmailComponent } from './customer-email/customer-email.component';
import { EntitiesService } from 'src/app/services/entities.service';
import { Options, RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { UserService } from 'src/app/services/user.service';
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
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.scss'],
  providers:[MessageService,ConfirmationService]
})
export class KanbanComponent extends Common implements AfterContentInit{
  @ViewChild('funSel') funSel:Dropdown|null = null;
  @ViewChild('cstEmail') cstEmail:CustomerEmailComponent|null = null;
  selectedFunnel:Funnel = {
    id: 0,
    name: '',
    is_default: false,
    type: 'V',
    stages: [],
    date_created: '',
    date_updated: null
  };
  stageToMove:FunnelStage = {
    id: 0,
    id_funnel: 0,
    name: '',
    icon: '',
    icon_color:'',
    color: '',
    order: 0,
    date_created: '',
    date_updated: null
  }
  stagesOfFunnel:FunnelStage[] = [];
  stagesToMove:FunnelStage[] = [];
  customersOfStage:RequestResponse[] = [];
  // representativeList:Entity[] = [];
  rows:number[]  = [];
  first:number[] = [];
  globalSearchInput:string|null = null;
  url_upload:string = '';
  uploadHeaders:HttpHeaders = new HttpHeaders()
    .set("Authorization",localStorage.getItem('token_type')+" "+localStorage.getItem('token_access'));

  stageChecked:Checkbox[] = [];
  massiveEmail:boolean = false;

  //exibe a tela de busca de clientes para associar em um funil
  showCustomers:boolean = false;
  all_funnels:Funnel[] = [];
  stages_from_funnel:FunnelStage[] = [];
  filtering:boolean = false;
  sendCustomer:boolean = false;
  entitiesToAddInCRM:Entity[] = [];
  selectedEntitiesToAddInCRM:Entity[] = [];
  selectedStageToCustomers!:FunnelStage;
  stageLoading:boolean = false;
  selectedFunnelToCustomers!:Funnel;


  //menu para ordenacao e atualizacao de cada estagio
  stageMenu:MenuItem[][] = [];
  stageOrderBy:DataOrder[] = [];
  
  //menu de busca de cada estagio
  stageSearch:any[][] = [];
  stageSearchCondition:DataSearch[] = [];
  stageSearchTerm:string[] = [];

  //trabalho com historico
  historyVisible:boolean = false;

  //upload de arquivo
  uploadVisible:boolean = false;

  //envio de email
  emailVisible:boolean = false;

  //importacao de registros
  importVisible:boolean = false;

  //painel de informacoes do cliente
  infoVisible:boolean    = false;
  funnelOfCustomer:number = 0;
  stageOfCustomer:number = 0;
  infoCustomer:Entity = {
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

  //dagable customer
  draggedCustomer:Entity|null = null;
  originDragableStage:number = 0;

  constructor(
    private msgSvc:MessageService,
    private svc:CrmService,
    private entSvc:EntitiesService,
    private svcL:LocationService,
    private usrSvc:UserService,
    private confirmService:ConfirmationService,
    route:Router){
    super(route);
  }
  
  ngAfterContentInit(): void {
    this.getFunnels();
  }

  getFunnels(p_query:string|null = null):void{
    //clear itens
    this.stagesOfFunnel = [];
    this.stageMenu      = [];
    this.stageSearch    = [];

    this.options.query ="can:list-all 1||"
    this.serviceSub[0] = this.svc.getFunnels(this.options).subscribe({
      next: (data) =>{
        this.response.data = data;
        this.response.data.forEach((funnel:Funnel) => {
          //verifica seh ha funil selecionado
          if(this.selectedFunnel.id==0){
            //nao havendo funil selecionado verifica se eh padrao
            if(funnel.is_default){
              //se o funil fo padrao define ele como selecionado
              this.selectedFunnel = funnel;
              //define os estagios do funil
              this.stagesOfFunnel = funnel.stages;
            }
          }else{
            //se dentro dos funis houver algum que eh igual ao selecionado
            if (funnel.id==(this.selectedFunnel as Funnel).id){
              this.stagesOfFunnel = funnel.stages;
            }
          }

          //monta o menu para cada estagio
          //monta o menu de busca para cada estagio
          //realiza a carga dos clientes de cada estagio
          //constroi o checkbox para cada stage
          this.stagesToMove = this.stagesOfFunnel;
          this.stagesOfFunnel.forEach((stg) =>{
            this.stageChecked[stg.id] = {};
            this.mountStageMenu(stg.id);
            this.mountSearchMenu(stg.id);
            this.loadCustomerState({
              first: 0,
              rows: 25,
              page:0
            },stg.id,false,p_query);
          });
        });
      },complete: () =>{
        //forca o dropdown a escolher o item selecionado, o ngModel eh bugado nesse componente
       //(this.funSel as Dropdown).selectItem(new Event(''),this.selectedFunnel);
       (this.funSel as Dropdown).selectedOption = this.selectedFunnel;
      },
      error: (err) =>{
        if (err.status==401){
          document.location.href='/'
        }
      },
    });
  }

  private mountStageMenu(idStage:number){
    if (this.stageMenu[idStage]==undefined){
      this.stageMenu[idStage] = [{
        icon:'crm-icon-refresh',
        label: 'Recarregar',
        command: () => {
          this.doLocalReload(idStage);
        }
      },{
        icon: 'pi pi-sort-alpha-down',
        label:'Ordernar de A-Z',
        escape:false,
        command:() =>{
          this.doLocalReload(idStage,DataOrder.ALFA_ASC)
        }
      },{
        icon: 'pi pi-sort-alpha-down-alt',
        label: 'Ordernar de Z-A',
        escape: false,
        command:() =>{
          this.doLocalReload(idStage,DataOrder.ALFA_DESC)
        }
      },{
        icon: 'pi pi-sort-amount-down-alt',
        label: 'Novos primeiro',
        escape:false,
        command:() =>{
          this.doLocalReload(idStage,DataOrder.QTD_DESC)
        }
      },{
        icon: 'pi pi-sort-amount-down',
        label: 'Antigos primeiro',
        escape:false,
        command:() =>{
          this.doLocalReload(idStage,DataOrder.QTD_ASC)
        }
      }];
    }
  }

  private mountSearchMenu(idStage:number){
    if(this.stageSearch[idStage]==undefined){
      this.stageSearch[idStage] = [{
        label: 'Contenha...',
        type: DataSearch.CONTAINS
      },{
        label: 'Exatamente...',
        type: DataSearch.EXACT
      },{
        label: 'Iniciando com...',
        type: DataSearch.START_WITH
      },{
        label: 'Terminando com...',
        type: DataSearch.ENDS_WITH
      }];
    }
  }

  loadCustomerState(evt:any,idStage:number,has_next:boolean=false,query:string|null = null){
    this.rows[idStage]  = evt.rows;
    this.first[idStage] = evt.first;
    let opts:Options = {
      page: (evt.page+1),
      query: (query==null)?'':query as string,
      pageSize: this.sysconfig.system_pagination_size
    }
    this.customersOfStage[idStage] = {
      pagination:{
        has_next: has_next,
        page: 1,
        pages: 0,
        per_page: 25,
        registers:0
      },
      data: []
    };
    this.svc.getCustomersOfStage(idStage,opts).subscribe({
      next: (data) =>{
        this.customersOfStage[idStage] = data as RequestResponse;
      }
    });
  }

  doGlobalSearch(evt:KeyboardEvent):void{
    if(evt.key=='Enter'){
      this.stagesOfFunnel.forEach((stg:FunnelStage) =>{
        this.loadCustomerState({
          first:0,
          rows:25,
          page:0
        },stg.id,false,"is:search %"+this.globalSearchInput+"%");
      });
    }
  }

  doLocalSearch(stagId:number):void{
    let query = "";
    if(this.stageSearchCondition[stagId]==DataSearch.CONTAINS && this.stageSearchTerm[stagId].trim().length>0){
      query = "is:search %"+this.stageSearchTerm[stagId]+"%";
    }else if(this.stageSearchCondition[stagId]==DataSearch.ENDS_WITH && this.stageSearchTerm[stagId].trim().length>0){
      query = "is:search %"+this.stageSearchTerm[stagId];
    }else if(this.stageSearchCondition[stagId]==DataSearch.EXACT && this.stageSearchTerm[stagId].trim().length>0){
      query = "is:search "+this.stageSearchTerm[stagId];
    }else if(this.stageSearchCondition[stagId]==DataSearch.START_WITH && this.stageSearchTerm[stagId].trim().length>0){
      query = "is:search "+this.stageSearchTerm[stagId]+"%";
    }else{
      this.stageSearchCondition[stagId] = DataSearch.CONTAINS;
      this.stageSearchTerm[stagId] = "";
    }

    if(query!=""){
      if (this.stageOrderBy[stagId]==DataOrder.ALFA_ASC){
        query += "||is:order ASC||is:order_by name"
      }else if(this.stageOrderBy[stagId]==DataOrder.ALFA_DESC){
        query += "||is:order DESC||is:order_by name"
      }else if(this.stageOrderBy[stagId]==DataOrder.QTD_ASC){
        query += "||is:order ASC||is:order_by date_created"
      }else if(this.stageOrderBy[stagId]==DataOrder.QTD_DESC){
        query += "||is:order DESC||is:order_by date_created"
      }
    }

    this.loadCustomerState({
      first:0,
      rows:25,
      page:0
    },stagId,false,query);
  }

  doLocalReload(stagId:number,ord:DataOrder = DataOrder.NONE){
    this.hasSended = true;
    let query:string = "";

    //se mandar atualizar pelo botao refresh irah zerar a query
    //e tambem os comandos jah executados
    if(ord==DataOrder.NONE){
      this.stageOrderBy[stagId] = DataOrder.NONE;
      this.stageSearchCondition[stagId] = DataSearch.CONTAINS;
      this.stageSearchTerm[stagId] = "";
    }

    this.stageOrderBy[stagId] = ord;

    if(ord==DataOrder.ALFA_ASC){
      query = "is:order ASC||is:order_by name";
    }
    if(ord==DataOrder.ALFA_DESC){
      query = "is:order DESC||is:order_by name";
    }
    if(ord==DataOrder.QTD_ASC){
      query = "is:order ASC||is:order_by date_created";
    }
    if(ord==DataOrder.QTD_DESC){
      query = "is:order DESC||is:order_by date_created";
    }

    if (query!=""){
      if(this.stageSearchCondition[stagId]==DataSearch.CONTAINS && this.stageSearchTerm[stagId].trim().length>0){
        query += "||is:search %"+this.stageSearchTerm[stagId]+"%";
      }else if(this.stageSearchCondition[stagId]==DataSearch.ENDS_WITH && this.stageSearchTerm[stagId].trim().length>0){
        query += "||is:search %"+this.stageSearchTerm[stagId];
      }else if(this.stageSearchCondition[stagId]==DataSearch.EXACT && this.stageSearchTerm[stagId].trim().length>0){
        query += "||is:search "+this.stageSearchTerm[stagId];
      }else if(this.stageSearchCondition[stagId]==DataSearch.START_WITH && this.stageSearchTerm[stagId].trim().length>0){
        query += "||is:search "+this.stageSearchTerm[stagId]+"%";
      }
    }

    this.loadCustomerState({
      first: 0,
      rows: 25,
      page:0
    },stagId,false,query);
    
  }

  showHistory(customer:Entity){
    this.infoCustomer = customer;
    this.historyVisible = true;
  }

  showUpload(customer:Entity){
    this.infoCustomer = customer;
    this.url_upload = this.envconfig.backend_cmm+'/upload/'+customer.id;
    this.uploadVisible = true;
  }

  showCustomerInfo(idCustomer:number,idStage:number){
    this.infoCustomer.id = idCustomer;
    this.stageOfCustomer = idStage;
    this.funnelOfCustomer = this.selectedFunnel.id;
    this.infoVisible = true;
  }

  showEmailSend(customer:Entity){
    this.infoCustomer = customer;
    this.emailVisible = true;
    this.massiveEmail = false;
    (this.cstEmail as CustomerEmailComponent).emailToList = customer.contacts.filter(contact => contact.contact_type=='E');
  }

  showEmailSendMassive(){
    (this.cstEmail as CustomerEmailComponent).emailToList = [];
    let customers:number[] = [];
    //varre cada um dos estagios do funil
    this.stagesOfFunnel.forEach((stag:FunnelStage) =>{
      this.customersOfStage[stag.id].data.forEach((customer:Entity) =>{
        //move cada cliente
        if(this.stageChecked[stag.id][customer.id]==true){
          customers.push(customer.id);
          let contact = customer.contacts.filter((contact) => {
            return (contact.contact_type=='E' && contact.is_default==true)              
          });
          (this.cstEmail as CustomerEmailComponent).emailToList.push(contact[0] as EntityContact);
        }
      });
    });

    if(customers.length>0){
      this.emailVisible = true;
      this.massiveEmail = true;
    }else{
      this.confirmService.confirm({
        message: 'Não há cliente(s) selecionado(s), por favor selecione ao menos 1 para enviar e-mail!',
        header: 'Seleção de cliente(s)',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'OK',
        rejectVisible: false
      });
    }
  }

  checkAll(stagId:number){
    this.customersOfStage[stagId].data.forEach((customer:Entity) =>{
      this.stageChecked[stagId][customer.id] = !this.stageChecked[stagId][customer.id];
    });
  }

  startMove(customer:Entity,stagId:number):void{
    this.draggedCustomer = customer;
    this.originDragableStage = stagId;
  }

  finishMove(stagId:number):void{
    if(this.originDragableStage!=stagId){
      let dragged:Entity = this.draggedCustomer as Entity;
      this.svc.moveCustomerToStage(dragged.id,stagId).subscribe();
      this.draggedCustomer = null;
      this.doLocalReload(stagId);
      this.doLocalReload(this.originDragableStage)
      this.originDragableStage = 0;
      //desmarca no estagio de origem
      this.stageChecked[this.originDragableStage][dragged.id] = false;
    }
  }

  moveSelectedsToStage(){
    let customers:number[] = [];
    //varre cada um dos estagios do funil
    this.stagesOfFunnel.forEach((stag:FunnelStage) =>{
      this.customersOfStage[stag.id].data.forEach((customer:Entity) =>{
        //move cada cliente
        if(this.stageChecked[stag.id][customer.id]==true){
          customers.push(customer.id);
        }
      });
    });

    if (customers.length > 0){
      this.svc.moveCustomersToState(customers,this.stageToMove.id).subscribe({
        next: (data) =>{
          if(data){
            this.showMessage({ key:'systemToast',severity:'success',summary:'Cliente(s) movido(s) com sucesso!'});
            this.getFunnels('can:list_all true');
          }else{
            this.showMessage({ key:'systemToast',severity:'error',summary:'Não foi possível mover o(s) cliente(s)!'});
          }            
        }
      });
    }else{
      this.confirmService.confirm({
        message: 'Não há cliente(s) selecionado(s), por favor selecione ao menos 1 para mover!',
        header: 'Seleção de cliente(s)',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'OK',
        rejectVisible: false
      });
    }
  }

  getStagesOfFunnel(evt:DropdownChangeEvent){
    this.stagesToMove = evt.value.stages as FunnelStage[];
  }

  showMessage(msg:Message){
    this.emailVisible   = false;
    this.infoVisible    = false;
    this.importVisible  = false;
    this.uploadVisible  = false;
    this.historyVisible = false;

    //se houver stageOfCustomer significa que esta
    //cadastrando ou atualizando o cadastro
    //entao forca o reload do stage
    if(this.stageOfCustomer > 0){
      this.doLocalReload(this.stageOfCustomer);
      this.stageOfCustomer = 0;
    }
    this.msgSvc.clear();
    this.msgSvc.add(msg);
  }

  resetForm(evt:Event){
    this.infoVisible = false;
    this.infoCustomer = {
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
      files: [],
      postal_code: '',
      neighborhood: '',
      address: '',
      type: 'C',
      date_created: undefined,
      date_updated: undefined,
      agent: null
    };
  }

  uploadDone(){
    this.uploadVisible = false;
    this.showMessage({ key:'systemToast',severity:'success',summary:'Arquivo(s) enviado(s) com sucesso!'});
  }

  addTask(cst:Entity):void{

  }

  delCustomersSelected(){
    let customers:number[] = [];
    //varre cada um dos estagios do funil
    this.stagesOfFunnel.forEach((stag:FunnelStage) =>{
      this.customersOfStage[stag.id].data.forEach((customer:Entity) =>{
        //move cada cliente
        if(this.stageChecked[stag.id][customer.id]==true){
          customers.push(customer.id);
        }
      });
    });

    if (customers.length > 0){
      this.confirmService.confirm({
        message: 'Esta ação apenas irá remover o(s) cliente(s) do Funil/Estágio! <br>Deseja realmente continuar?<br><br><small>* Para excluir um cliente do sistema, acesse o módulo Admin.</small>',
        header:'Confirmar remoção de cliente(s)',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'Sim',
        rejectLabel: 'Não',
        rejectButtonStyleClass:'p-button-danger',
        accept: () =>{
          this.svc.removeCustomers(customers).subscribe({
            next: (data) =>{
              if(data){
                this.showMessage({key:'systemToast',severity:'success',summary:'Cliente(s) removido(s) com sucesso!'});
                this.getFunnels('can:list_all true');
              }else{
                this.showMessage({key:'systemToast',severity:'error',summary:'Ocorreu um erro ao tentar remover o(s) cliente(s)!'});
              }
            }
          });
        }
      });
    }else{
      this.confirmService.confirm({
        message: 'Não há cliente(s) selecionado(s), por favor selecione ao menos 1 para remover!',
        header: 'Seleção de cliente(s)',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel:'OK',
        rejectVisible: false
      });
    }
  }

  // searchUser(evt:AutoCompleteCompleteEvent){
  //   if(evt.query.length>3){
  //     let filtered:any[] = [];
  //     let query = evt.query;
  //     for (let i = 0; i < (this.all_users as User[]).length; i++) {
  //       let user = (this.all_users as User[])[i];
  //       if (user.username.toLowerCase().indexOf(query.toLowerCase()) == 0) {
  //           filtered.push(user);
  //       }
  //     }

  //     this.filtered_users = filtered;
  //   }
  // }

  openToImport():void{
    this.importVisible = true;
  }

  changeFunnel(evt:DropdownChangeEvent):void{
    let funnel:Funnel = evt.value as Funnel;

    //se o funil fo padrao define ele como selecionado
    this.selectedFunnel = funnel;
    //define os estagios do funil
    this.stagesOfFunnel = funnel.stages;

    //monta o menu para cada estagio
    //monta o menu de busca para cada estagio
    //realiza a carga dos clientes de cada estagio
    //constroi o checkbox para cada stage
    this.stagesToMove = this.stagesOfFunnel;
    this.stagesOfFunnel.forEach((stg) =>{
      this.stageChecked[stg.id] = {};
      this.mountStageMenu(stg.id);
      this.mountSearchMenu(stg.id);
      this.loadCustomerState({
        first: 0,
        rows: 25,
        page:0
      },stg.id,false,null);
    });
  }

  searchCustomers():void{
    this.showCustomers = true;
    this.entitiesToAddInCRM = [];
    this.all_funnels = [];

    this.svc.getFunnels({page:1,pageSize:1,query:"can:list-all 1"}).subscribe({
      next: (data) =>{
        if("error_details" in data){
          this.showMessage({
            key:'systemToast',
            summary:"Falha...",
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
            severity:"error"
          });
        }else{
          this.all_funnels = data as Funnel[];
        }
      }
    })
    
    //listar clientes que nao estao em nenhum funil
    this.svc.getCustomersWihoutStage().subscribe({
      next:(data) =>{
        if ( "error_details" in data){
          this.showMessage({
            key:'systemToast',
            summary:"Falha...",
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
            severity:"error"
          });
        }else{
          this.entitiesToAddInCRM = data as Entity[];
        }
      }
    });
  }

  clearSearch(){
    this.showCustomers = false;
  }

  cancelMassive():void{
    this.entitiesToAddInCRM = [];
    this.selectedEntitiesToAddInCRM = [];
    this.showCustomers = false;
  }

  onAddToCRM():void{
    this.sendCustomer = true;
    let ids:number[] = [];
      this.selectedEntitiesToAddInCRM.forEach((u) =>{
        ids.push(u.id);
      });

    this.svc.addCustomersToStage(
      this.selectedStageToCustomers?.id,
      this.selectedEntitiesToAddInCRM
    ).subscribe({
      next:(data) =>{
        this.sendCustomer = false;
        this.msgSvc.clear();
        this.selectedEntitiesToAddInCRM = [];
        if(typeof data==='boolean'){
          this.msgSvc.add({
            key: 'systemToast',
            severity:"success",
            summary:"Sucesso!",
            detail:"Cliente(s) adicionado(s) com sucesso ao estágio "+this.selectedStageToCustomers.name+" do funil "+this.selectedFunnelToCustomers.name+"!"
          });
          this.showCustomers = false;
          //this.loadingData();
          this.cancelMassive();
        }else{
          this.msgSvc.add({
            key: 'systemToast',
            severity: 'error',
            summary: 'Ocorreu o seguinte erro no sistema!',
            detail: (data as ResponseError).error_details
          });
        }
      }
    });
  }

  getFunnelStages(evt:DropdownChangeEvent):void{
    //console.log(evt);
    this.stageLoading = true;
    this.svc.listStages({page:1,pageSize:1,query:'can:list-all 1 ||is:funnel '+this.selectedFunnel?.id.toString()}).subscribe({
      next: (data) =>{
        this.stageLoading = false;
        if ("error_details" in data){
          this.showMessage({
            key:'systemToast',
            summary:"Falha...",
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
            severity:"error"
          });
        }else{
          this.stages_from_funnel = data as FunnelStage[];
        }
      }
    });
  }
}
