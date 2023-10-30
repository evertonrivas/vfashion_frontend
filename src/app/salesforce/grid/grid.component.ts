import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem, SelectItemGroup } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse } from 'src/app/models/paginate.model';
import { ProductsService } from 'src/app/services/products.service';
import { FilterService as SysFilter } from 'src/app/services/filter.service';
import { Product } from 'src/app/models/product.model';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Color } from 'echarts';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';

export interface SelectedImg{
  [index:number]:string
}

export interface SelectedColor{
  [index:number]:number
}

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers:[MessageService,ConfirmationService]
})
export class GridComponent extends Common implements AfterViewInit, OnChanges{
  @ViewChild('ddColors') ddColors:Dropdown|null = null;
  layout: any = 'grid';
  sortOptions!: SelectItemGroup[];
  all_colors:Color[] = [];
  selectedImg:SelectedImg = {};
  selectedItemColor:SelectedColor = [];
  freeGridButton:boolean = false;
  selectedGridColor:Color|null = null;
  sendAddGrid:boolean = false;

  constructor(route:Router,
    private svcProd:ProductsService,
    private svcFil:SysFilter,
    private cdr:ChangeDetectorRef,
    private config:PrimeNGConfig,
    private cfg:ConfirmationService,
    private msg:MessageService){
    super(route);
    this.config.ripple = true;
  }

  ngAfterViewInit(): void {
    this.svcFil.listColor({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next:(data) =>{
        this.all_colors = data as Color[];
      }
    });

    this.sortOptions = [
      { label: 'Ordem Crescente', value:'asc', items: [
        { label: 'Menor Preço', value: '1' },
        { label: 'Categoria/Coordenado A-Z', value: '2'},
        { label: 'Coleção A-Z', value: '3' },
        { label: 'Marca A-Z', value: '4' },
        { label: 'Modelo A-Z', value: '5' },
        { label: 'Tipo A-Z', value: '6' }
      ]},
      { label: 'Ordem Descrescente', value: 'desc', items:[
        { label: 'Maior Preço', value: '-1' },
        { label: 'Categoria/Coordenado Z-A', value: '-2'},
        { label: 'Coleção Z-A', value: '-3' },
        { label: 'Marca Z-A', value: '-4' },
        { label: 'Modelo Z-A', value: '-5' },
        { label: 'Tipo Z-A', value: '-6' },
      ]}
    ];
    this.listProducts();
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.svcFil.filterAnnouced$.subscribe({
      next:(data) =>{
        this.options.query  = 'is:brand '+data.brands.join(",");
        this.options.query += "||is:model "+data.models.join(",");
        this.options.query += "||is:category "+data.categories.join(",");
        this.options.query += "||is:collection "+data.collections.join(",");
        this.options.query += "||is:color "+data.colors.join(",");
        this.options.query += "||is:size"+data.sizes.join(",");
        
      }
    })
    this.listProducts();
    this.cdr.detectChanges();
  }

  listProducts(){
    this.loading = true;
    this.options.page     = 1;
    this.options.pageSize = parseInt(this.sysconfig.system.pageSize);
    this.options.query    = "is:order_by price||is:order desc";
    this.svcProd.listGallery(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.loading  = false;
      }
    });
  }

  loadProducts(evt:PaginatorState = { page:0, pageCount:1}){
    this.options.page = (evt.page as number)+1;
    this.listProducts();
  }

  setImage(id:number,p_img:string):void{
    this.selectedImg[id] = p_img;
  }

  addGrid(id:number):void{
    if(this.selectedItemColor[id]==undefined){
      this.showDialog = true;
    }
    else{
      
    }
  }

  addToCart(id:number):void{

  }

  addCheckedToCart():void{
    this.sendAddGrid = true;
    if(this.selectedGridColor==null){
      return;
    }else{
      this.cfg.confirm({
        header:"Confirmação",
        message:'Deseja realmente adicionar todo(s) o(s) produto(s) marcado(s) ao pedido? <br><small>Atenção: Somente serão adicionado(s) o(s) produto(s) existente(s) na cor selecionada.</small>',
        acceptLabel:'Sim',
        acceptIcon:'pi pi-check',
        accept: () =>{
          //adiconar metodo de adicionar produtos ao grid
          //exibir mensagem de adicionados com sucesso e tambem incrementar o contador na topbar
        },
        rejectLabel:'Não',
        rejectButtonStyleClass:'p-button-danger',
        rejectIcon:'pi pi-ban'
      });
    }
  }

  verifyAndFreeButton():void{
    let prod:Product|undefined = (this.response.data as Product[]).find(p => p.checked==true);
    if(prod!=undefined){
      this.freeGridButton = true;
    }else{
      this.freeGridButton = false;
    }
  }

  checkUncheckAllGrid(evt:CheckboxChangeEvent): void {
    (this.response.data as Product[]).forEach((p) =>{
      p.checked = evt.checked;
      if(!evt.checked){
        if(this.ddColors!=null){
          this.ddColors.selectItem(new Event(''),null);
          this.ddColors.filterValue = '';
          this.ddColors.onChange.emit();
          this.sendAddGrid = false;
        }
      }
    });
    if(evt.checked){
      this.freeGridButton = true;
    }else{
      this.freeGridButton = false;
    }
  }

  orderGrid(evt:DropdownChangeEvent):void{
    switch(evt.value){
      case 1: this.options.query += "||is:order-by price||is:order asc"; break;
      case 2: this.options.query += "||is:order-by category||is:order asc"; break;
      case 3: this.options.query += "||is:order-by collection||is:order asc"; break;
      case 4: this.options.query += "||is:order-by brand||is:order asc"; break;
      case 5: this.options.query += "||is:order-by model||is:order asc"; break;
      case 6: this.options.query += "||is:order-by type||is:order asc"; break;

      case -1: this.options.query += "||is:order-by price||is:order desc"; break;
      case -2: this.options.query += "||is:order-by category||is:order desc"; break;
      case -3: this.options.query += "||is:order-by collection||is:order desc"; break;
      case -4: this.options.query += "||is:order-by brand||is:order desc"; break;
      case -5: this.options.query += "||is:order-by model||is:order desc"; break;
      case -6: this.options.query += "||is:order-by type||is:order desc"; break;
    }
  }
}
