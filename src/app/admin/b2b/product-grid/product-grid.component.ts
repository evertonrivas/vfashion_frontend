import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";
import { PaginatorState } from 'primeng/paginator';
import { Options, RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { ProductsService } from 'src/app/services/products.service';
import { FormComponent } from 'src/app/common/form/form.component';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { Color, ProductGrid, ProductGridDistribution, Size } from 'src/app/models/product.model';
import { ColorService } from 'src/app/services/color.service';
import { SizeService } from 'src/app/services/size.service';

interface sizes{
  id_size:number,
  size:string,
  value:number
}

interface localDistribution{
  [index:number]:{
    value:number
  }
}

@Component({
    selector: 'app-product-grid',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './product-grid.component.html',
    styleUrl: './product-grid.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})
export class ProductGridComponent extends Common implements AfterViewInit,OnDestroy{
  localObject!:ProductGrid;
  localDistribution:ProductGridDistribution[] = [];
  showDistribution:boolean = false;
  all_size:FieldOption[] = [];

  distributionInGrid:ProductGridDistribution[] = [];
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:ProductsService,
    private svcC:ColorService,
    private svcS:SizeService){
    super(route)
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }
  
  ngOnDestroy(): void {
    this.serviceSub.forEach((f) =>{
      f.unsubscribe();
    });
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

    this.serviceSub[1] = this.svc.listGrid(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });

    //carga dos tamanhos
    this.svcS.list({page:1,pageSize:1,query:'can:list-all 1'}).subscribe({
      next: (data) =>{
        if ("error_details" in data){

        }else{
          (data as Size[]).forEach(c =>{
            this.all_size.push({
              id: c.id,
              label: c.name + " ( "+c.new_size+" )",
              value: c.id
            });
          });
        }
        // this.all_size = data as Size[];
        // this.all_size.forEach(s =>{
        //   if(this.formDistribution[s.id] == undefined){
        //     this.formDistribution[s.id] = {
        //       value: 0
        //     }
        //   }
        // });
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto da Busca",
      placeholder:"Nome ou descrição",
      type: FieldType.INPUT,
      filter_name: "search",
      filter_prefix: "is",
      name:"",
      options:undefined,
      value:undefined
    });
  }

  onEditData(id:number = 0):void{
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
      case: FieldCase.NONE,
      disabled: false,
      lockField: undefined
    };
    this.idToEdit = id;

    let fieldSizes:FormField = {
      label: "Tamanhos",
      name: "sizes",
      options: this.all_size,
      placeholder:"Selecione...",
      type:FieldType.MCOMBO,
      value:undefined,
      required:true,
      case:FieldCase.NONE,
      disabled:false,
      lockField:undefined
    }

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.loadGrid(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as ProductGrid;
            fieldName.value = this.localObject.name;
            let f:number[] = [];
            this.all_size.forEach(c =>{
              this.localObject.sizes.forEach(s =>{
                if(s.id == c.id){
                  f.push(c.id);
                }
              });
            });

            fieldSizes.value = f;

            //monta as linhas do form e exibe o mesmo
            this.formRows.push({ fields: [fieldName]});
            this.formRows.push({ fields: [fieldSizes]});
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
      this.formRows.push({ fields: [fieldSizes]});
      this.formVisible = true;
    }
  }

  cnfOnDataSave(data:any):void{
    if(this.idToEdit >0 ){
      this.cnf.confirm({
        header:"Atenção ao atualizar",
        message:"Ao alterar as informações, os dados de estoques poderão sofrer alteração. Deseja realmente continuar?",
        acceptLabel:"Sim",
        rejectLabel:"Não",
        rejectButtonStyleClass:"p-button-danger",
        accept: () =>{
          this.onDataSave(data);
        }
      });
    }
    else{
      this.onDataSave(data);
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.saveGrid(data).subscribe({
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
          ids.push((v as ProductGrid).id);
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

  onEditGrid(id:number):void{
    this.idToEdit = id;
    this.svc.loadGridDistribution(id).subscribe({
      next:(data) =>{
        this.localDistribution = data as ProductGridDistribution[];
      }
    });
    this.showDistribution = true;
  }

  onDeleteGrid(id:number,id_color:number = 0):void{
    this.svc.deleteGridDistribution(id,id_color).subscribe({
      next:(data) =>{
        if(typeof data==='boolean'){
          this.msg.add({
            severity:"success",
            summary:"Sucesso!",
            detail:"Distribuição excluída com sucesso!"
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

  onCancelEdit():void{
    this.showDistribution = false;
  }

  onSaveGrid():void{
    this.loading = true;

    this.svc.saveGridDistribution(this.idToEdit,this.localDistribution).subscribe({
      next:(data) =>{
        this.msg.clear();
        this.loading = false;
        this.showDistribution = false;
        if(typeof data ==='number'){
          this.msg.add({
            summary: 'Sucesso!',
            severity: 'success',
            detail: 'Distribuição adicionada com sucesso!'
          });
        }else if(typeof data === 'boolean'){
          this.msg.add({
            summary:'Sucesso!',
            severity:'success',
            detail:'Distribuição atualizada com sucesso!'
          });
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte erro: "+(data as ResponseError).error_details,
            severity:"error"
          });
        }
      }
    })
  }

  // onViewGrid(evt:PaginatorState = { page: 0, pageCount: 0},id:number){
  //   if (id > 0){
  //     this.loadingGrid = true;

  //     this.serviceSub[2] = this.svc.listGridDistribution(id).subscribe({
  //       next: (data) =>{
  //         this.distributionInGrid = data as ProductGridDistribution[];
  //         this.sizes = this.distributionInGrid[0].sizes;
  //         this.cdr.detectChanges();
  //         this.loadingGrid = false;
  //       }
  //     });
  //   }
  // }

  onHideGrid(){
    this.distributionInGrid = [];
  }
}
