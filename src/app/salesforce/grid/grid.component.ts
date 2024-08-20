import { AfterViewInit, ChangeDetectorRef, Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig, SelectItem, SelectItemGroup } from 'primeng/api';
import { PaginatorState } from 'primeng/paginator';
import { Common } from 'src/app/classes/common';
import { RequestResponse, ResponseError } from 'src/app/models/paginate.model';
import { Product,Image, ProductStock, SubTotal } from 'src/app/models/product.model';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { Color as B2bColor } from 'src/app/models/product.model';
import { Dropdown, DropdownChangeEvent } from 'primeng/dropdown';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { EntitiesService } from 'src/app/services/entities.service';
import { Entity } from 'src/app/models/entity.model';
import { Dialog } from 'primeng/dialog';
import { IndicatorsService } from 'src/app/services/indicators.service';
import { CartItem } from 'src/app/models/order.model';
import { SysService } from 'src/app/services/sys.service';
import { ColorService } from 'src/app/services/color.service';

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
export class GridComponent extends Common implements AfterViewInit{
  @ViewChild('dlSelectCustomer') dlSelectCustomer!:Dialog
  @ViewChild('ddColors') ddColors:Dropdown|null = null;
  isAddGrid:boolean = false;
  sortOptions: SelectItemGroup[] = [];
  all_colors:B2bColor[] = [];
  selectedImg:SelectedImg = {};
  selectedItemColor:SelectedColor = [];
  //habilita ou libera o seletor de cor "Todos"
  freeGridButton:boolean = false;
  selectedGridColor:B2bColor|null = null;
  sendAddGrid:boolean = false;
  filtered:boolean = false;
  showNoCustomerDialog:boolean = false;
  showAddToCartDialog:boolean  = false;
  sizeKeys:string[] = []; //chaves para montar os tamanhos de forma dinamica
  
  selectedProduct!:number;
  selectedCustomer:number = 0;
  all_customers:Entity[]  = [];
  productToCart!:Product;
  productToCartImage!:Image;
  productToCartStock!:ProductStock[];
  productToCartSubtotal:SubTotal = {};

  constructor(route:Router,
    private ssvc:SysService,
    private cdr:ChangeDetectorRef,
    private config:PrimeNGConfig,
    private cfg:ConfirmationService,
    private svcOrd:B2bOrderService,
    private svcEnt:EntitiesService,
    private svcInd:IndicatorsService,
    private msg:MessageService,
    private svcCo:ColorService){
    super(route);
    this.config.ripple = true;

    //busca padrao do sistema em caso refresh ou inicio da tela
    this.options.query    = "is:order_by price||is:order asc";

    this.sortOptions.push({
      label:'Crescente',
      value:'',
      items: [{
        value:'1',
        label: 'Menor Preço'
      },{
        value:'2',
        label:'Categoria - AZ'
      },{
        value:'3',
        label:'Coleção - AZ'
      },{
        value:'4',
        label:'Marca - AZ'
      },{
        value:'5',
        label:'Modelo - AZ'
      },{
        value:'6',
        label:'Tipo - AZ'
      }]
    },{
      label:'Decrescente',
      value:'',
      items:[{
        value:'-1',
        label:'Maior Preço'
      },{
        value:'-2',
        label:'Categoria - ZA'
      },{
        value:'-3',
        label:'Coleção - ZA'
      },{
        value:'-4',
        label:'Marca - ZA'
      },{
        value:'-5',
        label:'Modelo - ZA'
      },{
        value:'-6',
        label:'Tipo - ZA'
      }]
    });

    this.ssvc.filterB2bAnnounced$.subscribe({
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

        //realiza a busca
        this.listProducts();
      }
    });
  }

  ngAfterViewInit(): void {
    this.listProducts();
    this.cdr.detectChanges();
    this.listColors();
    this.cdr.detectChanges();    
  }

  listProducts(){
    this.loading = true;
    this.options.page = 1;
    this.options.pageSize = this.sysconfig.system_pagination_size;
    this.svcOrd.listGallery(this.options).subscribe({
      next: (data) =>{
        this.response = data as RequestResponse;
        this.cdr.detectChanges();
        this.loading  = false;
      }
    });
  }

  listColors(){
    this.loading = true;
    this.svcCo.list({
      page:1,
      pageSize: this.sysconfig.system_pagination_size,
      query:'can:list-all 1'
    }).subscribe({
      next: (data) =>{
        this.all_colors = data as B2bColor[];
      }
    })
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
  addGrid(prod:Product):void{
    this.isAddGrid = true;
    if(prod.colors.length == 1 ){
      this.selectedItemColor[prod.id] = prod.colors[0].id;
    }
    else if(prod.colors.length > 1 && this.selectedItemColor[prod.id]==undefined){
      this.showDialog = true;
    }
    
    if(this.selectedItemColor[prod.id]!=undefined){
      //verifica se existe o cliente
      if(this.level_access==this.levels.ADMIN || this.level_access==this.levels.REPR){
        //carrega os clientes 
        if(localStorage.getItem("id_customer")=="" || localStorage.getItem("id_customer")==null){
          this.loadCustomers(this.level_access==this.levels.REPR?true:false);
          this.showNoCustomerDialog = true;
          this.selectedProduct = prod.id;
        }else{
          this.selectedCustomer = parseInt(JSON.stringify(localStorage.getItem("id_customer")).replaceAll('"',''));
          this.saveGrid([prod.id],this.selectedItemColor[prod.id],this.selectedCustomer);
        }
      }else{
        let ids:number[] = [];
        ids.push(prod.id);
        let customer:number = parseInt(localStorage.getItem("id_profile") as string);
        this.saveGrid(ids,this.selectedItemColor[prod.id],customer);
      }
    }
  }

  addCheckedToGrid():void{
    this.isAddGrid = true;
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
          if(this.level_access==this.levels.ADMIN || this.level_access==this.levels.REPR){
            //carrega os clientes 
            this.loadCustomers(this.level_access==this.levels.REPR?true:false);
            this.showNoCustomerDialog = true;
            this.selectedProduct = 0;
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

  closeAndSave():void{

    if(localStorage.getItem("id_customer")=="" || localStorage.getItem("id_customer")==null){
      localStorage.setItem("id_customer",this.selectedCustomer.toString());
    }

    this.showNoCustomerDialog = false;
    if(this.isAddGrid){
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
    }else{
      this.getStockAndShowDialog();
    }
  }

  saveGrid(ids:number[],color:number,customer:number):void{
    this.svcOrd.addGridToCart(ids,color,customer,parseInt(localStorage.getItem("id_user") as string)).subscribe({
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
          });
        }
      }
    });
  }

  prepareToAddToCart(id:number):void{
    this.isAddGrid = false;
    //verifica se existe o cliente
    if(this.level_access==this.levels.ADMIN || this.level_access==this.levels.REPR){
      //carrega os clientes 
      this.loadCustomers(this.level_access==this.levels.REPR?true:false);
      this.showNoCustomerDialog = true;
      this.selectedProduct = id;
    }else{
      this.getStockAndShowDialog();
    }
  }

  getStockAndShowDialog():void{
    (this.response.data as Product[]).forEach((p) =>{
      if(p.id==this.selectedProduct){
        this.productToCart = p;
        this.productToCart.images.forEach((img) =>{
          if(img.default==true){
            this.productToCartImage = img;
          }
        });
        this.svcOrd.get_stock(this.selectedProduct).subscribe({
          next: (data) =>{
            this.productToCartStock = data as ProductStock[];
            this.showAddToCartDialog = true;

            this.productToCartStock.forEach((pstk) =>{
              pstk.sizes.forEach((sz) =>{
                if (this.productToCartSubtotal[this.productToCart.id]==undefined){
                  this.productToCartSubtotal[this.productToCart.id] = {};
                  if(this.productToCartSubtotal[this.productToCart.id][pstk.color_code]==undefined){
                    this.productToCartSubtotal[this.productToCart.id][pstk.color_code] = 0;
                  }else{
                    this.productToCartSubtotal[this.productToCart.id][pstk.color_code] += sz.size_value;
                  }
                }

                //obtem apenas os tamanhos do produto para configurar
                if (this.sizeKeys.find(function(valor){
                  return sz.size_code===valor;
                })===undefined){
                  this.sizeKeys.push(sz.size_code);
                }
              });
            });
          }
        });
      }
    });
  }

  addToCart():void{
    let cart:CartItem[] = [];
    this.productToCartStock.forEach((ps) =>{
      ps.sizes.forEach((sz) =>{
        let item:CartItem = {
          id_customer: this.selectedCustomer,
          id_product: this.productToCart.id,
          id_color: ps.color_id,
          id_size: sz.size_id,
          quantity: sz.size_saved,
          price: this.productToCart.price,
          user_create: parseInt(localStorage.getItem("id_user") as string),
          date_create: new Date(),
          user_update: null,
          date_update: null
        }
        cart.push(item);
      });
    })
    this.svcOrd.addToCart(cart).subscribe({
      next: (data) =>{
        this.msg.clear();
        this.showAddToCartDialog = false;
        if(typeof data==='boolean'){
          if(data==true){
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: 'Produto adicionado com sucesso ao pedido.'
            });
            this.svcInd.annunceCounter();
          }else{
            this.msg.add({
              severity:'error',
              summary:'Falha!',
              detail: 'Ocorreu um problema ao tentar adicionar o produto'
            });
          }
        }else{
          this.msg.add({
            severity:'error',
            summary:'Problema!',
            detail: (data as ResponseError).error_details
          });
        }
      }
    });
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
          //this.ddColors.selectItem(new Event(''),null);
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

  changeAndSum(codColor:string):void{
    this.productToCartSubtotal[this.productToCart.id][codColor] = 0;
    this.productToCartStock.forEach((stk) =>{
       stk.sizes.forEach((sz) =>{
        if(codColor==stk.color_code){
          this.productToCartSubtotal[this.productToCart.id][stk.color_code] += sz.size_saved;
        }
       });
    });
  }
}
