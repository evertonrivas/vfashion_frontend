import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { ProductsService } from 'src/app/services/products.service';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldCase, FieldType } from 'src/app/models/system.enum';
import { FieldOption, FormField, FormRow } from 'src/app/models/field.model';
import { B2bBrand, Color, Product, ProductCategory, ProductCollection, ProductModel, ProductType, Size } from 'src/app/models/product.model';
import { forkJoin } from 'rxjs';
import { BrandService } from 'src/app/services/brand.service';
import { ModelService } from 'src/app/services/model.service';
import { CollectionService } from 'src/app/services/collection.service';
import { CategoryService } from 'src/app/services/category.service';
import { ColorService } from 'src/app/services/color.service';
import { SizeService } from 'src/app/services/size.service';
import { ProductTypeService } from 'src/app/services/product.type.service';
import { FormComponent } from 'src/app/common/form/form.component';

@Component({
    selector: 'app-products',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent,
        FormComponent
    ]
})
export class ProductsComponent extends Common implements AfterViewInit {
  localObject!:Product;
  constructor(route:Router,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:ProductsService,
    private cdr:ChangeDetectorRef,
    private svcB:BrandService,
    private svcM:ModelService,
    private svcCl:CollectionService,
    private svcCt:CategoryService,
    private svcCo:ColorService,
    private svcS:SizeService,
    private svcT:ProductTypeService
    ){
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

    this.serviceSub[0] = this.svc.listProducts(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto",
      placeholder: "Nome, Descrição, Observação, Código de Barras ou Referência...",
      name: "text",
      filter_name: "search",
      filter_prefix: "is",
      options:undefined,
      value:undefined,
      type: FieldType.INPUT
    });

    const $pBrand  = this.svcB.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pModel  = this.svcM.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCollec = this.svcCl.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCateg  = this.svcCt.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pColor  = this.svcCo.list({page:1, pageSize:1,query:'can:list-all 1'});
    const $pSize   = this.svcS.list({page:1,pageSize:1,query:'can:list-all 1'});
    const $pType   = this.svcT.list({page:1,pageSize:1,query:'can:list-all 1'});

    this.serviceSub [1] = forkJoin([$pBrand,$pModel,$pCollec,$pCateg,$pColor,$pSize,$pType]).subscribe(([valBrand,valModel,valCollec,valCateg,valColor,valSize,valType]) =>{
      let optBrand:FieldOption[]  = [];
      let optModel:FieldOption[]  = [];
      let optCollec:FieldOption[] = [];
      let optCateg:FieldOption[]  = [];
      let optColor:FieldOption[]  = [];
      let optSize:FieldOption[]   = [];
      let optType:FieldOption[]   = [];
      
      (valBrand as B2bBrand[]).forEach((b) =>{
        optBrand.push({value: b.id, label: b.name as string});
      });

      (valModel as ProductModel[]).forEach((m) =>{
        optModel.push({value: m.id, label: m.name});
      });

      (valCollec as ProductCollection[]).forEach((c) =>{
        optCollec.push({value: c.id, label: c.name});
      });

      (valCateg as ProductCategory[]).forEach((c) =>{
        optCateg.push({value: c.id, label: c.name as string});
      });

      (valColor as Color[]).forEach((c) =>{
        optColor.push({value: c.id, label: c.name});
      });

      (valSize as Size[]).forEach((s) =>{
        optSize.push({value: s.id, label: s.name});
      });

      (valType as ProductType[]).forEach((t) =>{
        optType.push({value: t.id, label: t.name});
      });

      this.filters.push({
        label:"Marca",
        placeholder:"Selecione...",
        name:"brand",
        filter_name:"brand",
        filter_prefix:"is",
        type: FieldType.COMBO,
        value:undefined,
        options: optBrand
      });

      this.filters.push({
        label:"Coleção(ões)",
        placeholder:"Selecione...",
        name:"collection",
        filter_name:"collection",
        filter_prefix:"is",
        type:FieldType.COMBO,
        value:undefined,
        options:optCollec
      });

      this.filters.push({
        label:"Categoria(s)",
        placeholder:"Selecione...",
        name:"category",
        filter_name:"category",
        filter_prefix:"is",
        type:FieldType.COMBO,
        value:undefined,
        options:optCateg
      });

      this.filters.push({
        label: "Modelo",
        placeholder:"Selecione...",
        name:"model",
        filter_name:"model",
        filter_prefix:"is",
        type: FieldType.COMBO,
        value:undefined,
        options: optModel
      });

      this.filters.push({
        label: "Tipo",
        placeholder:"Selecione...",
        name:"type",
        filter_name:"type",
        filter_prefix:"is",
        type: FieldType.COMBO,
        value:undefined,
        options: optType
      });

      this.filters.push({
        label: "Tamanho(s)",
        placeholder:"Selecione...",
        name:"size",
        filter_name:"size",
        filter_prefix:"is",
        type: FieldType.COMBO,
        value:undefined,
        options: optSize
      });

      this.filters.push({
        label: "Cor(es)",
        placeholder:"Selecione...",
        name:"color",
        filter_name:"color",
        filter_prefix:"is",
        type: FieldType.COMBO,
        value:undefined,
        options: optColor
      });
    });
  }

  onEditData(id:number = 0):void{
    //limpa o formulario
    this.formRows = [];
    let fieldName:FormField = {
      label: "Descrição",
      name: "description",
      options: undefined,
      placeholder: "Digite a descrição...",
      type: FieldType.INPUT,
      value: undefined,
      required: true,
      case: FieldCase.UPPER,
      disabled: false
    };
    this.idToEdit = id;

    if(id>0){
      //busca os dados do registro para edicao
      this.serviceSub[2] = this.svc.load(id).subscribe({
        next: (data) =>{
          if ("name" in data){
            this.localObject = data as Product;
            fieldName.value = this.localObject.description;

            //monta as linhas do forme e exibe o mesmo
            let row:FormRow = {
              fields: [fieldName]
            }
            this.formRows.push(row);
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
      this.formRows.push(row);
      this.formVisible = true;
    }
  }

  onDataSave(data:any):void{
    this.hasSended = true;
    this.serviceSub[3] = this.svc.save(data).subscribe({
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
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
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
          ids.push((v as Product).id);
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
                detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
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
}
