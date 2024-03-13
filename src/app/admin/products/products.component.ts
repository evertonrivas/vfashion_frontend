import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { RequestResponse } from 'src/app/models/paginate.model';
import { ProductsService } from 'src/app/services/products.service';
import { SysFilterService } from 'src/app/services/sys.filter.service';
import { FilterComponent } from "../../common/filter/filter.component";
import { FieldType } from 'src/app/models/system.enum';
import { Field, FieldOption } from 'src/app/models/field.model';
import { B2bBrand, Color, ProductCategory, ProductCollection, ProductModel, ProductType, Size } from 'src/app/models/product.model';
import { forkJoin } from 'rxjs';

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
        FilterComponent
    ]
})
export class ProductsComponent extends Common implements AfterViewInit {
  constructor(route:Router,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:ProductsService,
    private cdr:ChangeDetectorRef,
    private sfil:SysFilterService){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loadingData();
    this.cdr.detectChanges();
    this.loadingFilterData();
  }

  loadingData(evt:PaginatorState = { page: 0, pageCount: 0}):void{
    this.loading = true;
    this.options.page = ((evt.page as number)+1);
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

    const $pBrand  = this.sfil.listBrand({page:1,pageSize:1,query:'can:list-all 1'});
    const $pModel  = this.sfil.listModel({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCollec = this.sfil.listCollection({page:1,pageSize:1,query:'can:list-all 1'});
    const $pCateg  = this.sfil.listCategory({page:1,pageSize:1,query:'can:list-all 1'});
    const $pColor  = this.sfil.listColor({page:1, pageSize:1,query:'can:list-all 1'});
    const $pSize   = this.sfil.listSize({page:1,pageSize:1,query:'can:list-all 1'});
    const $pType   = this.sfil.listType({page:1,pageSize:1,query:'can:list-all 1'});

    this.serviceSub [1] = forkJoin([$pBrand,$pModel,$pCollec,$pCateg,$pColor,$pSize,$pType]).subscribe(([valBrand,valModel,valCollec,valCateg,valColor,valSize,valType]) =>{
      let optBrand:FieldOption[]  = [];
      let optModel:FieldOption[]  = [];
      let optCollec:FieldOption[] = [];
      let optCateg:FieldOption[]  = [];
      let optColor:FieldOption[]  = [];
      let optSize:FieldOption[]   = [];
      let optType:FieldOption[]   = [];
      
      (valBrand as B2bBrand[]).forEach((b) =>{
        optBrand.push({option: b.id, value: b.name as string});
      });

      (valModel as ProductModel[]).forEach((m) =>{
        optModel.push({option: m.id,value: m.name});
      });

      (valCollec as ProductCollection[]).forEach((c) =>{
        optCollec.push({option: c.id,value: c.name});
      });

      (valCateg as ProductCategory[]).forEach((c) =>{
        optCateg.push({option: c.id,value: c.name as string});
      });

      (valColor as Color[]).forEach((c) =>{
        optColor.push({option: c.id,value: c.name});
      });

      (valSize as Size[]).forEach((s) =>{
        optSize.push({option: s.id,value: s.name});
      });

      (valType as ProductType[]).forEach((t) =>{
        optType.push({option: t.id,value: t.name});
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

  editData(id:number){

  }
}
