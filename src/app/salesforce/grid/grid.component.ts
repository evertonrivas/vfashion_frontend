import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem, SelectItemGroup } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { B2bFilterService as SysFilter } from 'src/app/services/b2b.filter.service';
import { Product } from 'src/app/models/product.model';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Color as B2bColor } from 'src/app/models/product.model';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { EntitiesService } from 'src/app/services/entities.service';
import { Entity } from 'src/app/models/entity.model';
import { Dialog } from 'primeng/dialog';
import { IndicatorsService } from 'src/app/services/indicators.service';

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
  @ViewChild('dlSelectCustomer') dlSelectCustomer!:Dialog
  @ViewChild('ddColors') ddColors:Dropdown|null = null;
  layout: any = 'grid';
  sortOptions!: SelectItemGroup[];
  all_colors:B2bColor[] = [];
  selectedImg:SelectedImg = {};
  selectedItemColor:SelectedColor = [];
  freeGridButton:boolean = false;
  selectedGridColor:B2bColor|null = null;
  sendAddGrid:boolean = false;
  filtered:boolean = false;
  showNoCustomerDialog:boolean = false;
  
  selectedProduct!:number;
  selectedCustomer:number = 0;
  all_customers:Entity[]  = [];

  constructor(route:Router,
    private svcFil:SysFilter,
    private cdr:ChangeDetectorRef,
    private config:PrimeNGConfig,
    private cfg:ConfirmationService,
    private svcOrd:B2bOrderService,
    private svcEnt:EntitiesService,
    private svcInd:IndicatorsService,
    private msg:MessageService){
    super(route);
    this.config.ripple = true;

    //busca padrao do sistema em caso refresh ou inicio da tela
    this.options.query    = "is:order_by price||is:order asc";

    this.svcFil.filterAnnouced$.subscribe({
      next:(data) =>{
        this.options.query = '';
        this.filtered = true;
        if (data.brands.length > 0){
          this.options.query  += "||is:brand "+data.brands.join(",");
        }
        if(data.models.length > 0){
          this.options.query += "||is:model "+data.models.join(",");
        }
        if(data.categories.length > 0 ){
          this.options.query += "||is:category "+data.categories.join(",");
        }
        if(data.categories.length > 0){
          this.options.query += "||is:collection "+data.collections.join(",");
        }
        if(data.colors.length > 0){
          this.options.query += "||is:color "+data.colors.join(",");
        }
        if(data.sizes.length > 0){
          this.options.query += "||is:size "+data.sizes.join(",");
        }

        //se houver limpo o filtro volta para o padrao
        if(data.brands.length==0 && data.models.length==0 && data.categories.length==0 && data.collections.length==0 && data.colors.length==0 && data.sizes.length==0){
          this.options.query = "is:order-by price||is:order asc";
        }
        this.listProducts();
      }
    });
  }

  ngAfterViewInit(): void {
    this.svcFil.listColor({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next:(data) =>{
        this.all_colors = data as B2bColor[];
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
    this.listProducts();
    this.cdr.detectChanges();
  }

  listProducts(){
    this.loading = true;
    this.options.page = 1;
    this.options.pageSize = parseInt(this.sysconfig.system.pageSize);
    this.svcOrd.listGallery(this.options).subscribe({
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

  loadCustomers(is_representative:boolean = false):void{
    this.svcEnt.listEntity({page:1,pageSize:1,query:'can:list-all 1||is:type C||is:order-by fantasy_name'+(is_representative?'||is:representative '+localStorage.getItem('id_profile'):'')}).subscribe({
      next:(data) =>{
        this.all_customers = data as Entity[];
      }
    });
  }

  //adiciona apenas um item pela grade
  addGrid(id:number):void{
    if(this.selectedItemColor[id]==undefined){
      this.showDialog = true;
    }
    else{
      //verifica se existe o cliente
      if(localStorage.getItem("level_access")=='A' || localStorage.getItem("level_access")=='R'){
        //carrega os clientes 
        this.loadCustomers(localStorage.getItem("level_access")=='R'?true:false);
        this.showNoCustomerDialog = true;
        this.selectedProduct = id;
      }else{
        let ids:number[] = [];
        ids.push(id);
        let customer:number = parseInt(localStorage.getItem("id_profile") as string);
        this.saveGrid(ids,this.selectedItemColor[id],customer);
      }
    }
  }

  addCheckedToGrid():void{
    this.sendAddGrid = true;
    if(this.selectedGridColor==null){
      return;
    }else{
      this.cfg.confirm({
        header:"Confirmação",
        message:'Deseja realmente adicionar todo(s) o(s) produto(s) marcado(s) ao pedido? <br><br><small><span class="text-red-500">Atenção:</span> Somente serão adicionado(s) o(s) produto(s) existente(s) na cor selecionada e que utilizam a grade padrão.</small>',
        acceptLabel:'Sim',
        acceptIcon:'pi pi-check mr-1',
        accept: () =>{
          let all_products:number[] = [];
          (this.response.data as Product[]).forEach((p) =>{
            if(p.checked){
              all_products.push(p.id);
            }
          });
            
          let cor:B2bColor = this.selectedGridColor as B2bColor;

          //verifica se existe o cliente pelo tipo de acesso
          if(localStorage.getItem("level_access")=='A' || localStorage.getItem("level_access")=='R'){
            //carrega os clientes 
            this.loadCustomers(localStorage.getItem("level_access")=='R'?true:false);
            this.showNoCustomerDialog = true;
            this.selectedProduct = 0;
            //this.saveGrid(all_products,cor.id,this.selectedCustomer);
          }else{
            //adiconar metodo de adicionar produtos ao grid
            let cst:number = parseInt(localStorage.getItem("id_profile") as string);
            this.saveGrid(all_products,cor.id,cst);
          }
        },
        rejectLabel:'Não',
        rejectButtonStyleClass:'p-button-danger',
        rejectIcon:'pi pi-ban mr-1'
      });
    }
  }

  closeAndSaveGrid():void{
    this.showNoCustomerDialog = false;
    if(this.selectedProduct > 0 ){
      let ids:number[] = [];
      ids.push(this.selectedProduct);
      this.saveGrid(ids,this.selectedItemColor[this.selectedProduct],this.selectedCustomer);
    }else{
      let all_products:number[] = [];
      (this.response.data as Product[]).forEach((p) =>{
        if(p.checked){
          all_products.push(p.id);
        }
      });
        
      let cor:B2bColor = this.selectedGridColor as B2bColor;

      this.saveGrid(all_products,cor.id,this.selectedCustomer);
    }
  }

  saveGrid(ids:number[],color:number,customer:number):void{
    //this.svcOrd.addGridToCart(ids,this.selectedItemColor[id],customer).subscribe({
    this.svcOrd.addGridToCart(ids,color,customer).subscribe({
      next:(data) => {
        if(typeof data === 'boolean'){
          if(data==true){
            this.msg.add({
              severity:'success',
              summary:'Sucesso!',
              detail:'Produto(s) adicionado(s) ao pedido com sucesso!'
            });
            this.svcInd.annunceCounter();
          }else{
            this.msg.add({
              severity:'error',
              summary:'Erro!',
              detail:'Ocorreu um erro ao tentar adicionar o produto ao pedido!'
            });
          }
        }else{
          this.msg.add({
            severity:'error',
            summary:'Erro de Programação!',
            detail: (data as ResponseError).error_details
          })
        }
      }
    });
  }

  addToCart(id:number):void{

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
    if (!this.filtered){
      this.options.query = "";
    }
    switch(evt.value){
      case "1": this.options.query += "||is:order-by price||is:order asc"; break;
      case "2": this.options.query += "||is:order-by category||is:order asc"; break;
      case "3": this.options.query += "||is:order-by collection||is:order asc"; break;
      case "4": this.options.query += "||is:order-by brand||is:order asc"; break;
      case "5": this.options.query += "||is:order-by model||is:order asc"; break;
      case "6": this.options.query += "||is:order-by type||is:order asc"; break;

      case "-1": this.options.query += "||is:order-by price||is:order desc"; break;
      case "-2": this.options.query += "||is:order-by category||is:order desc"; break;
      case "-3": this.options.query += "||is:order-by collection||is:order desc"; break;
      case "-4": this.options.query += "||is:order-by brand||is:order desc"; break;
      case "-5": this.options.query += "||is:order-by model||is:order desc"; break;
      case "-6": this.options.query += "||is:order-by type||is:order desc"; break;
    }

    this.listProducts();
  }
}
