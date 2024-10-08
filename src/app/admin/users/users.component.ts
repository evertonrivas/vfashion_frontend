import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/common/shared.module';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FormComponent } from 'src/app/common/form/form.component';
import { FormField, FormRow } from 'src/app/models/field.model';
import { User } from 'src/app/models/user.model';
import { EntitiesService } from 'src/app/services/entities.service';
import { Entity } from 'src/app/models/entity.model';
import { PasswordModule } from 'primeng/password';
import { City, StateRegion } from 'src/app/models/place.model';
import { LocationService } from 'src/app/services/location.service';

export interface filterParams{
  level: string|undefined,
  rule:any|undefined
  state_region: StateRegion|undefined
  password:string|undefined,
  city:City|undefined,
  user_type: any|undefined
}

@Component({
    selector: 'app-users',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './users.component.html',
    styleUrl: './users.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent,
        PasswordModule
    ]
})
export class UsersComponent extends Common implements AfterViewInit{
  localObject!:User;
  showDialogReset:boolean = false;
  usernameReset:string = '';
  tempPassword:string = '';
  visibleMassive:boolean = false;
  entitiesToCreateUser:Entity[] = [];
  selectedEntitiesToCreateUser:Entity[] = [];
  filtersToSearch:filterParams = {
    level: undefined,
    rule: undefined,
    state_region: undefined,
    password: undefined,
    city: undefined,
    user_type: undefined
  };
  states:StateRegion[] = [];
  cities:City[] = [];
  sendMassive:boolean = false;
  validate:boolean = false;
  filtering:boolean = false;
  constructor(route:Router,
    private svc:UserService,
    private svcE:EntitiesService,
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
    this.loadingFilterData();
    this.svcL.listStageRegions({page:1,pageSize:1,query:'can:list-all 1||order-by acronym||order asc'}).subscribe({
      next:(data) =>{
        this.states = data as StateRegion[];
      }
    });
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    //se nao existe trash no query
    if(this.options.query.indexOf("active")==-1){
      this.options.query += (pTrash==true?"active 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("active 1||","");
      }
    }

    this.serviceSub[2] = this.svc.list(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Login do sistema",
      placeholder: "Username...",
      name: "text",
      filter_name: "search",
      filter_prefix: "is",
      options:undefined,
      value:undefined,
      type: FieldType.INPUT
    });

    this.filters.push({
      label:"Nível de acesso",
      placeholder:"Selecione...",
      name:"access_level",
      filter_name:"type",
      filter_prefix:"is",
      options:[{
        value: "A",
        label:"Administrador",
        id:undefined
      },{
        value: "L",
        label:"Lojista",
        id:undefined
      },{
        value:"R",
        label:"Representante",
        id:undefined
      },{
        value:"V",
        label:"Vendedor",
        id:undefined
      },{
        value:"C",
        label:"Usuário da Empresa",
        id:undefined
      }],
      value:undefined,
      type: FieldType.COMBO
    });

    this.filters.push({
      label:"Ativo",
      placeholder:"",
      name:"active",
      filter_name:"active",
      filter_prefix:"is",
      options:[{
        value:true,
        label:"Sim",
        id:undefined
      },{
        value:false,
        label:"Não",
        id:undefined
      }],
      value:undefined,
      type:FieldType.RADIO
    })
  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];
    this.idToEdit = id;
    let fieldName:FormField = {
      label:"Login do sistema",
      name: "username",
      options: undefined,
      placeholder: "Digite o username...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case:FieldCase.LOWER,
      disabled: false,
      lockField:undefined
    };

    let fLevel:FormField = {
      label: "Nível de Acesso",
      name: "type",
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      options: [
        { value:'A', label:'Administrador',id:undefined },
        { value:'L', label:'Lojista',id:undefined },
        { value:'I', label:'Lojista (IA)',id:undefined },
        { value:'R', label:'Representante',id:undefined },
        { value:'U', label:'Usuário da Empresa',id:undefined }
      ],
      required: true,
      case: FieldCase.UPPER,
      disabled: false,
      lockField:undefined
    }

    let fActive:FormField = {
      label: "Ativo",
      name: "active",
      placeholder: undefined,
      type: FieldType.RADIO,
      value: undefined,
      options: [{ value:'0', label:'Não',id:undefined },{ value:'1', label:'Sim',id:undefined }],
      required: true,
      case: FieldCase.NONE,
      disabled: false,
      lockField:undefined
    }

    let fEntity:FormField = {
      label:"Entidade",
      name: "id_entity",
      placeholder: "Selecione...",
      type: FieldType.COMBO,
      value: undefined,
      required: false,
      case:FieldCase.NONE,
      disabled: false,
      options: [],
      lockField:undefined
    }
    this.svcE.listEntity({page:1,pageSize:1,query:"can:list-all 1"}).subscribe({
      next: (data) =>{
        (data as Entity[]).forEach((e) =>{
          fEntity.options?.push({
            value: e.id.toString(),
            label: (e.type=='C'?'CLIENTE - ':(e.type=='R'?'REPRESENTANTE - ':(e.type=='P'?'PESSOA (FÍSICA) - ':'FORNECEDOR - '))) + e.name,
            id:undefined
          });
        });
      },
      complete: () =>{
        this.cdr.detectChanges();
      }
    });

    let fPwd:FormField = {
      label: "Senha: | Confirmar senha:",
      name:"password",
      placeholder:"Digite sua senha | Confirme a senha digitada",
      type: FieldType.PASSWD,
      value: [undefined,undefined],
      required:true,
      case: FieldCase.NONE,
      disabled:false,
      options: undefined,
      lockField:undefined
    }

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.load(id).subscribe({
        next: (data) =>{
          if ("username" in data){
            this.localObject = data as User;
            fieldName.value = this.localObject.username;
            fActive.value   = this.localObject.active;

            switch(this.localObject.type){
              case 'A': fLevel.value = { value:'A', label:'Administrador' }; break;
              case 'L': fLevel.value = { value:'L', label:'Lojista' }; break;
              case 'I': fLevel.value = { value:'I', label:'Lojista (IA)' }; break;
              case 'R': fLevel.value = { value:'R', label:'Representante' }; break;
              case 'U': fLevel.value = { value:'U', label:'Usuário da Empresa' }; break;
            }

            fEntity.options?.forEach((o) =>{
              if(o.value ==this.localObject.id_entity){
                fEntity.value = o;
              }
            });

            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fieldName]
            }
            let row1:FormRow = {
              fields: [fEntity]
            }
            let row2:FormRow = {
              fields: [fLevel,fActive]
            }
            let row3:FormRow = {
              fields: [fPwd]
            }
            this.formRows.push(row);
            this.formRows.push(row1);
            this.formRows.push(row2);
            this.formRows.push(row3);
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
        fields: [fEntity]
      }
      let row2:FormRow = {
        fields: [fLevel,fActive]
      }
      let row3:FormRow = {
        fields: [fPwd]
      }
      this.formRows.push(row);
      this.formRows.push(row1);
      this.formRows.push(row2);
      this.formRows.push(row3);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.save([data]).subscribe({
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
      header:"Confirmação de "+(pSendToTrash==true?"inativação":"reativação"),
      message:"Deseja realmente "+(pSendToTrash==true?"inativar":"reativar")+" o(s) registro(s) marcado(s)?",
      acceptLabel:"Sim",
      acceptIcon:"pi pi-check mr-1",
      acceptButtonStyleClass:"p-button-sm",
      accept:() =>{
        let ids:number[] = [];
        this.tableSelected.forEach((v) =>{
          ids.push((v as User).id);
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
                detail:"Registro(s) "+(pSendToTrash==true?"inativado":"reativado")+"(s) com sucesso!"
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

  addUsers():void{
    this.visibleMassive = true;
  }

  resetUserPassword(id:number,uname:string):void{
    this.svc.resetPassword(id).subscribe({
      next:(data) =>{
        if(typeof data ==='string'){
          this.usernameReset   = uname;
          this.showDialogReset = true;
          this.tempPassword = data as string;
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

  getCities():void{
    this.svcL.listCities({page:1,pageSize:1,query:"can:list-all 1||is:state_region "+this.filtersToSearch.state_region?.id}).subscribe({
      next:(data) =>{
        this.cities = data as City[];
      }
    })
  }

  searchToCreate():void{
    this.filtering = true;
    let nquery:string = "can:list-all 1||";
    if (this.filtersToSearch.city!=undefined){
      nquery += "id_city "+this.filtersToSearch.city.id+"||";
    }
    if (this.filtersToSearch.state_region!=undefined){
      nquery += "id_state_region "+this.filtersToSearch.state_region.id+"||";
    }
    if (this.filtersToSearch.level!=undefined){
      nquery += "type "+this.filtersToSearch.level+"||";
    }
    this.svcE.listEntity({ page:1, pageSize:1, query:nquery}).subscribe({
      next:(data) =>{
        this.filtering = false;
        this.entitiesToCreateUser = data as Entity[];
      }
    });
  }

  cancelMassive():void{
    this.filtersToSearch = {
      city:undefined,
      level: undefined,
      password: undefined,
      rule: undefined,
      state_region: undefined,
      user_type: undefined
    }
    this.entitiesToCreateUser = [];
    this.selectedEntitiesToCreateUser = [];
    this.visibleMassive = false;
  }

  executeMassive():void{
    this.validate = true;
    if(this.filtersToSearch.rule!=undefined && this.filtersToSearch.password!=undefined && this.filtersToSearch.user_type!=undefined){
      this.validate = false;
      this.sendMassive = true;

      let ids:number[] = [];
      this.selectedEntitiesToCreateUser.forEach((u) =>{
        ids.push(u.id);
      });

      this.svc.userMassive(ids,
        this.filtersToSearch.password as string, 
        this.filtersToSearch.rule.value as string,
        this.filtersToSearch.user_type.value as string).subscribe({
        next:(data) =>{
          this.sendMassive = false;
          this.msg.clear();
          if(typeof data==='boolean'){
            this.msg.add({
              severity:"success",
              summary:"Sucesso!",
              detail:"Registro(s) criado(s) com sucesso!"
            });
            this.visibleMassive = false;
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
  }
}
