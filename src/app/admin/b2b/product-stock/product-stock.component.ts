import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';
import { PaginatorState } from 'primeng/paginator';
import { forkJoin } from 'rxjs';
import { Common } from 'src/app/classes/common';
import { FilterComponent } from 'src/app/common/filter/filter.component';
import { FormComponent } from 'src/app/common/form/form.component';
import { SharedModule } from 'src/app/common/shared.module';
import { Moment } from 'src/app/models/moment.model';
import { FieldOption } from 'src/app/models/field.model';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { B2bBrand, Color, ProductCategory, ProductGrid, ProductGridDistribution, ProductGridDistributionSize, ProductModel, ProductStockColor, ProductStockSizes2, ProductType, Size } from 'src/app/models/product.model';
import { FieldType } from 'src/app/models/system.enum';
import { BrandService } from 'src/app/services/brand.service';
import { CategoryService } from 'src/app/services/category.service';
import { MomentService } from 'src/app/services/moment.service';
import { ColorService } from 'src/app/services/color.service';
import { ModelService } from 'src/app/services/model.service';
import { ProductTypeService } from 'src/app/services/product.type.service';
import { ProductsService } from 'src/app/services/products.service';
import { SizeService } from 'src/app/services/size.service';
import { StockService } from 'src/app/services/stock.service';

@Component({
  selector: 'app-product-stock',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    FilterComponent,
    FormComponent
  ],
  templateUrl: './product-stock.component.html',
  styleUrl: './product-stock.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class ProductStockComponent extends Common implements AfterViewInit{
  all_grid:ProductGrid[] = [];
  selectedGrid!:ProductGrid;
  selectedGridSizes:ProductGridDistribution[] = [];
  ilimited:boolean = false;
  removeItem:boolean = false;
  all_colors:Color[] = [];
  selectedColors:Color[] = [];
  @ViewChild('pnlMassive') pnlMassive!:OverlayPanel;
  constructor(route:Router,
    private cdr:ChangeDetectorRef,
    private svc:StockService,
    private sMrk:BrandService,
    private sCat:CategoryService,
    private sMom:MomentService,
    private sCor:ColorService,
    private sType:ProductTypeService,
    private sGrid:ProductsService,
    private sModel:ModelService,
    private cfg:ConfirmationService,
    private msg:MessageService
  ){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.loadingFilterData();
    this.cdr.detectChanges();
  }

  doFilter(query:string):void{
    this.options.query = query;
    this.loadingData();
  }

  loadingData(evt:PaginatorState = {page:0, pageCount:0},pTrash:boolean = false):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);

    if(this.options.query.indexOf("trash")==-1){
      this.options.query += (pTrash==true?"trash 1||":"");
    }else{
      if(pTrash==false){
        this.options.query = this.options.query.replace("trash 1||","");
      }
    }

    this.serviceSub[1] = this.svc.list(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading = false;
      }
    });

    //realiza carga dos grids
    this.sGrid.listGrid({page:1,pageSize:1,query:'can:list-all 1'}).subscribe({
      next: (data) =>{
        if(data.hasOwnProperty("error_code")){
          this.msg.clear();
            this.msg.add({
              summary:"Falha...",
              detail: "Ocorreu um erro ao tentar carregar os registros de grades",
              severity:"error"
            });
        }else{
          this.all_grid = data as ProductGrid[];
        }
      }
    })
  }

  loadingFilterData():void{
    this.filters.push({
      label:"Texto",
      placeholder: "Nome, Descrição, Observação, Código de Barras ou Referência!",
      name: "text",
      filter_name: "search",
      filter_prefix: "is",
      options:undefined,
      value:undefined,
      type: FieldType.INPUT
    });

    const $pBrand  = this.sMrk.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'});
    const $pModel  = this.sModel.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'});
    const $pMoment = this.sMom.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'});
    const $pCateg  = this.sCat.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'});
    const $pColor  = this.sCor.list({page:1, pageSize:1,query:'can:list-all 1||is:order-by name'});
    const $pType   = this.sType.list({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'});

    this.serviceSub [1] = forkJoin([$pBrand,$pModel,$pMoment,$pCateg,$pColor,$pType]).subscribe(
      ([valBrand,valModel,valMoment,valCateg,valColor,valType]) =>{
      let optBrand:FieldOption[]  = [];
      let optModel:FieldOption[]  = [];
      let optMoment:FieldOption[] = [];
      let optCateg:FieldOption[]  = [];
      let optColor:FieldOption[]  = [];
      let optType:FieldOption[]   = [];
      
      (valBrand as B2bBrand[]).forEach((b) =>{
        optBrand.push({value: b.id, label: b.name as string, id:undefined});
      });

      (valModel as ProductModel[]).forEach((m) =>{
        optModel.push({value: m.id, label: m.name, id:undefined});
      });

      (valMoment as Moment[]).forEach((c) =>{
        optMoment.push({value: c.id, label: c.name, id:undefined});
      });

      (valCateg as ProductCategory[]).forEach((c) =>{
        optCateg.push({value: c.id, label: c.name as string, id:undefined});
      });

      this.all_colors = valColor as Color[];
      (valColor as Color[]).forEach((c) =>{
        optColor.push({value: c.id, label: c.name, id:undefined});
      });

      (valType as ProductType[]).forEach((t) =>{
        optType.push({value: t.id, label: t.name, id:undefined});
      });

      this.filters.push({
        label:"Marca",
        placeholder:"Selecione...",
        name:"brand",
        filter_name:"brand",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optBrand
      });

      this.filters.push({
        label:"Momentos(s)/Coleção(ões)",
        placeholder:"Selecione...",
        name:"collection",
        filter_name:"collection",
        filter_prefix:"is",
        type:FieldType.MCOMBO,
        value:undefined,
        options:optMoment
      });

      this.filters.push({
        label:"Categoria(s)",
        placeholder:"Selecione...",
        name:"category",
        filter_name:"category",
        filter_prefix:"is",
        type:FieldType.MCOMBO,
        value:undefined,
        options:optCateg
      });

      this.filters.push({
        label: "Modelo",
        placeholder:"Selecione...",
        name:"model",
        filter_name:"model",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optModel
      });

      this.filters.push({
        label: "Tipo",
        placeholder:"Selecione...",
        name:"type",
        filter_name:"type",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optType
      });

      this.filters.push({
        label: "Cor(es)",
        placeholder:"Selecione...",
        name:"color",
        filter_name:"color",
        filter_prefix:"is",
        type: FieldType.MCOMBO,
        value:undefined,
        options: optColor
      });
    });
  }

  onEditData(id:number = 0):void{
    
  }

  onDataSave(data:any):void{

  }

  onDataDelete(pSendToTrash:boolean):void{
    
  }

  onGetGrid(evt:any):void{
    if(evt!=undefined){
      this.sGrid.listGridDistribution(evt.id).subscribe({
        next: (data) =>{
          if (data.hasOwnProperty("error_details")){

          }else{
            this.selectedGridSizes = data as ProductGridDistribution[];
            this.selectedGridSizes.forEach(s =>{
              s.value = 0;
            });
          }
        }
      });
    }
  }

  onUpdateStockQuantity():void{
    let ids:number[] = [];
    let colors:number[] = [];
    this.tableSelected.forEach(s =>{
      ids.push(s.id_product);
    });
    
    this.selectedColors.forEach(c =>{
      colors.push(c.id);
    });

    this.pnlMassive.hide();

    this.svc.update(ids,colors,this.ilimited,this.selectedGridSizes,this.removeItem).subscribe({
      next: (data) =>{
        this.msg.clear();
        if(typeof data==='boolean'){
          this.msg.add({
            severity:"success",
            summary:"Sucesso!",
            detail:"Estoque atualizado com sucesso!"
          });
          this.loadingData();
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
}
