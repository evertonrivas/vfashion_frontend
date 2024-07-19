import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { TagModule } from 'primeng/tag';
import { Common } from 'src/app/classes/common';
import { RequestResponse } from 'src/app/models/paginate.model';
import { DevolutionStatus } from 'src/app/models/system.enum';
import { B2bDevolutionService } from 'src/app/services/b2b.devolution.service';
import { SharedModule } from 'src/app/common/shared.module';
import { Devolution } from 'src/app/models/devolution.model';

export interface selectedStatus{
  [index:string]:string
}

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TagModule
  ],
  templateUrl: './process.component.html',
  styleUrl: './process.component.scss',
  providers:[MessageService,ConfirmationService]
})
export class ProcessComponent extends Common implements AfterViewInit {
  selectedStatus:selectedStatus = {};
  localDevolution:Devolution = {
    id: 0,
    id_order: 0,
    status: undefined,
    date: undefined,
    customer: undefined,
    order_date: undefined,
    items: []
  };
  devStatus = DevolutionStatus;
  constructor(route:Router,
    private svc:B2bDevolutionService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private cdr:ChangeDetectorRef
  ){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    //se nao existe trash no query
    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"is:trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("is:trash 1||","");
      }
    }
    
    this.options.query = "is:no-status "+DevolutionStatus.SAVED+"||";
    this.serviceSub[0] = this.svc.listDevolution(this.options).subscribe({
      next:(data) =>{
        this.response = data as RequestResponse;
      }
    });
  }

  getSeverity(status:number):"success" | "secondary" | "info" | "warning" | "danger" | "contrast" | undefined{
    if(status==DevolutionStatus.SAVED){
      return "secondary";
    }else if(status==DevolutionStatus.APPROVED_ALL){
      return "success";
    }else if(status==DevolutionStatus.APPROVED_PART){
      return "info";
    }else if(status==DevolutionStatus.REJECTED){
      return "danger";
    }
    return "warning";
  }

  onCancel():void{
    // this.selectedOrder = undefined;
    // this.localOrder    = undefined;
    this.showDialog    = false;
  }

  onVerify(id:number):void{
    this.showDialog = true;
    this.serviceSub[1] = this.svc.getDevolution(id).subscribe({
      next:(data) =>{
        this.localDevolution = data as Devolution;
        (this.localDevolution as Devolution).items.forEach(i =>{
          if(this.selectedStatus[i.id_devolution_item]==undefined){
            this.selectedStatus[i.id_devolution_item] = '';
          }
        });
      }
    });
  }

  onPublish():void{
    this.hasSended = true;
    let validated = true;
    Object.keys(this.selectedStatus).forEach(k =>{
      if(this.selectedStatus[k] == ''){
        validated = false;
      }
    });

    if(!validated){
      return;
    }
    
    this.localDevolution.items.forEach(i =>{
      i.status = this.selectedStatus[i.id_devolution_item]=='Y'? true : false
    });

    this.svc.saveDevolution(this.localDevolution).subscribe({
      next: (data) =>{
        this.msg.clear();
        if (typeof data === 'boolean'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Registro atualizado com sucesso!",
            severity:"success"
          });
          this.showDialog = false;
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu um erro ao tentar carregar o registro",
            severity:"error"
          });
        }
      }
    });
  }

  onOrderNumber(id:number):string{
    return id.toString().padStart(10,"0");
  }
}
