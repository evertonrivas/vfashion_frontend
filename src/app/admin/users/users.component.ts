import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse } from 'src/app/models/paginate.model';
import { UserService } from 'src/app/services/user.service';
import { SharedModule } from 'src/app/common/shared.module';
import { CommonModule } from '@angular/common';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldType } from 'src/app/models/system.enum';
import { FieldOption } from 'src/app/models/field.model';
import { SysFilterService } from 'src/app/services/sys.filter.service';

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
        FilterComponent
    ]
})
export class UsersComponent extends Common implements AfterViewInit{

  constructor(route:Router,
    private svc:UserService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef,
    private sfil:SysFilterService){
    super(route);

    this.sfil.filterSysAnnounced$.subscribe({
      next:(data) =>{
        this.options.query = data;
        this.loadingData();
      }
    });
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
    this.serviceSub[0] = this.svc.userList(this.options).subscribe({
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
      filter_name:"access_level",
      filter_prefix:"is",
      options:[{
        option: "A",
        value:"Administrador"
      },{
        option: "L",
        value:"Lojista"
      },{
        option:"R",
        value:"Representante"
      },{
        option:"V",
        value:"Vendedor"
      },{
        option:"C",
        value:"Usuário da Empresa"
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
        option:true,
        value:"Sim"
      },{
        option:false,
        value:"Não"
      }],
      value:undefined,
      type:FieldType.RADIO
    })
  }

  editData(id:number):void{

  }

}
