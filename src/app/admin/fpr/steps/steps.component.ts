import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { FormComponent } from 'src/app/common/form/form.component';

@Component({
    selector: 'app-steps',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './steps.component.html',
    styleUrl: './steps.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})
export class StepsComponent extends Common implements AfterViewInit{
  constructor(route:Router,
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
  }

  onEditData(id:number = 0){
    
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    // this.serviceSub[3] = this.svc.save(this.idToEdit,data).subscribe({
    //   next:(data) =>{
    //     this.hasSended = false;
    //     this.formVisible = false;
    //     this.msg.clear();
    //     if(typeof data ==='number'){
    //       this.msg.add({
    //         summary:"Sucesso...",
    //         detail: "Registro criado com sucesso!",
    //         severity:"success"
    //       });
    //     }else if(typeof data ==='boolean'){
    //       this.msg.add({
    //         summary:"Sucesso...",
    //         detail: "Registro atualizado com sucesso!",
    //         severity:"success"
    //       });
    //     }else{
    //       this.msg.add({
    //         summary:"Falha...",
    //         detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
    //         severity:"error"
    //       });
    //     }
    //     this.loadingData();
    //   }
    // });
  }

  onDataDelete(pSendToTrash:boolean):void{
    // this.cnf.confirm({
    //   header:"Confirmação de "+(pSendToTrash==true?"exclusão":"restauração"),
    //   message:"Deseja realmente "+(pSendToTrash==true?"excluir":"restaurar")+" o(s) registro(s) marcado(s)?",
    //   acceptLabel:"Sim",
    //   acceptIcon:"pi pi-check mr-1",
    //   acceptButtonStyleClass:"p-button-sm",
    //   accept:() =>{
    //     let ids:number[] = [];
    //     this.tableSelected.forEach((v) =>{
    //       ids.push((v as Reason).id);
    //     });
    //     this.serviceSub[3] = this.svc.deleteReason(ids,pSendToTrash).subscribe({
    //       next: (data) =>{
    //         this.msg.clear();
    //         //carrega com base no botao de lixeira
    //         this.loadingData({page:0,pageCount:0},this.isTrash);
    //         //limpa os registros selecionados
    //         this.tableSelected = [];
    //         if (typeof data ==='boolean'){
    //           this.msg.add({
    //             severity:"success",
    //             summary:"Sucesso!",
    //             detail:"Registro(s) "+(pSendToTrash==true?"excluído":"restaurado")+"(s) com sucesso!"
    //           });
    //         }else{
    //           this.msg.add({
    //             summary:"Falha...",
    //             detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
    //             severity:"error"
    //           });
    //         }
    //       }
    //     });
    //   },
    //   rejectLabel:"Não",
    //   rejectIcon:"pi pi-ban mr-1",
    //   rejectButtonStyleClass:"p-button-danger p-button-sm"
    // });
  }
}
