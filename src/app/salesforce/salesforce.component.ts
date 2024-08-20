import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Common } from '../classes/common';
import { Router } from '@angular/router';
import { LayoutService } from '../services/layout.service';
import { forkJoin } from 'rxjs';
import { B2bBrand, Color, ProductCategory, ProductModel, ProductStock, ProductType, Size, SubTotal,Image, Product, ProductStockSizes } from '../models/product.model';
import { Options, ResponseError } from '../models/paginate.model';
import { Filter } from '../models/filter.model';
import { B2bOrderService } from '../services/b2b.order.service';
import { CartContent, CartItem } from '../models/order.model';
import { SysService } from '../services/sys.service';
import { BrandService } from '../services/brand.service';
import { CollectionService } from '../services/collection.service';
import { CategoryService } from '../services/category.service';
import { ProductTypeService } from '../services/product.type.service';
import { ModelService } from '../services/model.service';
import { SizeService } from '../services/size.service';
import { ColorService } from '../services/color.service';
import { Collection } from '../models/collection.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IndicatorsService } from '../services/indicators.service';

@Component({
  selector: 'app-salesforce',
  templateUrl: './salesforce.component.html',
  styleUrls: ['./salesforce.component.scss'],
  providers: [MessageService,ConfirmationService]
})
export class SalesforceComponent extends Common implements AfterViewInit{
  @Output() filteredEvent = new EventEmitter<Filter>();
  sidebarVisible:boolean = false;
  sidebarCart:boolean = false;
  all_brand:B2bBrand[] = [];
  all_collect:Collection[] = [];
  all_categ:ProductCategory[] = [];
  all_type:ProductType[] = [];
  all_model:ProductModel[] = [];
  all_size:Size[] = [];
  all_color:Color[] = [];
  cart_itens:CartContent[] = [];
  totalMyItens:number = 0;
  myTotal:number = 0;

  //edicao de produtos do carrinho
  STK!:ProductStock[]; //necessario para obter o estoque do produto
  productToCartStock!:ProductStock[];
  productToCartSubtotal:SubTotal = {};
  showEditCartDialog:boolean = false;
  productToCartImage!:Image;
  productToCart!:Product;
  sizeKeys:string[] = []; //monta na tela os tamanhos dos produtos

  //exclusao de itens do carrinho
  idToDelete:number = 0;
  idCustomerToDelete:number = 0;


  optBrand:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc' }
  optCollect:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc' }
  optCateg:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optType:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optModel:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}
  optSize:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by id||is:order asc'}
  optColor:Options = {page:1, pageSize:1, query:'can:list-all 1||is:order-by name||is:order asc'}

  filter:Filter = {
    brands: [],
    models: [],
    categories: [],
    types: [],
    collections: [],
    colors: [],
    sizes: [],
    query: ''
  }
 
  constructor(router:Router,
    private svcLay:LayoutService,
    private ssvc:SysService,
    private svcOrd:B2bOrderService,
    private svcB:BrandService,
    private svcCl:CollectionService,
    private svcCt:CategoryService,
    private svcT:ProductTypeService,
    private svcM:ModelService,
    private svcS:SizeService,
    private svcCo:ColorService,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svcInd:IndicatorsService
    ){
    super(router);
  }

  ngAfterViewInit(): void {
    //exibe ou oculta o menu de filtros
    this.svcLay.menuOpen$.subscribe({
      next: () =>{
          this.sidebarVisible = !this.sidebarVisible;
      }
    });

    //exibe ou oculta os itens do carrinho
    this.svcLay.cartOpen$.subscribe({
      next: () =>{
        this.loading = true;
        this.sidebarCart = !this.sidebarCart;
        if(this.sidebarCart==true){
          this.loadCartItens();
        }
      }
    });

    this.loadFilter();
    this.route.navigate(['/salesforce/grid']);
  }

  loadCartItens(){
    this.totalMyItens = 0;
    this.myTotal = 0;
    this.svcOrd.listMyItens(
      parseInt(localStorage.getItem("id_profile") as string),
      this.level_access as string
    ).subscribe({
      next:(data) =>{
        this.loading = false;
        this.cart_itens = data as CartContent[];
        this.cart_itens.forEach((c) =>{
          this.totalMyItens += c.itens;
          this.myTotal += c.total_price;
        });
      }
    });
  }

  loadFilter():void{
    const $brand   = this.svcB.list(this.optBrand);
    const $collect = this.svcCl.list(this.optCollect);
    const $categ   = this.svcCt.list(this.optCateg);
    const $type    = this.svcT.list(this.optType);
    const $model   = this.svcM.list(this.optModel);
    const $size    = this.svcS.list(this.optSize);
    const $color   = this.svcCo.list(this.optColor);

    this.serviceSub[0] = forkJoin([$brand,$collect,$categ,$type,$model,$size,$color])
    .subscribe({
      next:([brand,collect,categ,type,model,size,color])=>{
        this.all_brand   = brand as B2bBrand[];
        this.all_collect = collect as Collection[];
        this.all_categ   = categ as ProductCategory[]; 
        this.all_type    = type as ProductType[];
        this.all_model   = model as ProductModel[];
        this.all_size    = size as Size[];
        this.all_color   = color as Color[];
      }
    });
  }

  doFilter():void{
    this.route.navigate(["/salesforce/grid"]).finally(() =>{
      this.filteredEvent.emit();
      this.ssvc.announceB2bFilter(this.filter);
      this.sidebarVisible = false;
    });
  }

  gotoCheckout():void{
    this.sidebarCart = false;
    this.route.navigate([this.modulePath+'/checkout']);
  }

  editCart(p_idProduct:number,p_idCustomer:number):void{
    this.STK = [];
    this.productToCartStock = [];
    this.productToCartSubtotal = [];
    this.showEditCartDialog = true;

    if(this.productToCartSubtotal[p_idProduct]==undefined){
      this.productToCartSubtotal[p_idProduct] = {}
    }

    //busca o estoque original do produto
    this.svcOrd.get_stock(p_idProduct).subscribe({
      next: (data) =>{
        this.STK = data as ProductStock[];
        this.cart_itens.forEach((ct) =>{
          if(ct.id_product==p_idProduct && ct.id_customer==p_idCustomer){
    
            //apenas informacoes minimas
            this.productToCart = {
              id: p_idProduct,
              id_type:0,
              id_grid:0,
              id_model:0,
              prodCode:ct.ref,
              barCode:null,
              refCode: ct.ref,
              name: ct.name,
              description:null,
              observation:null,
              ncm:null,
              price: ct.price_un,
              id_measure_unit:0,
              structure:'S',
              date_created: new Date().toISOString().substring(0,10),
              date_updated:null,
              images: [],
              colors:[],
              checked:false          
            }
    
            //serve apenas para exibir a imagem
            this.productToCartImage = {
              id:0,
              img_url:ct.img_url,
              default:true
            }
    
            ct.colors.forEach((cl) =>{
              if(this.productToCartSubtotal[ct.id_product][cl.id]==undefined){
                this.productToCartSubtotal[ct.id_product][cl.id] = 0;
              }
              let ps:ProductStock = {
                color_id: cl.id,
                color_name: cl.name,
                color_hexa: cl.hexa,
                color_code: cl.code,
                sizes: [],
              }
    
              //busca os tamanhos da cor do estoque
              let stkCor:ProductStock = this.STK.find((p) => p.color_id==cl.id) as ProductStock;
    
              cl.sizes.forEach((sz) =>{
                let size:ProductStockSizes = {
                  size_id: sz.id,
                  size_name: sz.name,
                  size_saved: sz.quantity,
                  size_code:'',
                  size_value: stkCor.sizes.find((psz) => psz.size_id == sz.id)?.size_value as number
                }
                this.productToCartSubtotal[ct.id_product][cl.id] += sz.quantity;
                ps.sizes.push(size);
              });
              this.productToCartStock.push(ps);
            });
          }
        });
      }
    });
  }

  changeAndSum(codColor:number):void{
    this.productToCartSubtotal[this.productToCart.id][codColor] = 0;
    this.productToCartStock.forEach((stk) =>{
       stk.sizes.forEach((sz) =>{
        if(codColor==stk.color_id){
          this.productToCartSubtotal[this.productToCart.id][stk.color_id] += sz.size_saved;
        }
       });
    });
  }

  saveCart():void{
    let cart:CartItem[] = [];
    this.productToCartStock.forEach((ps) =>{
      ps.sizes.forEach((sz) =>{
        let item:CartItem = {
          id_customer: (this.cart_itens.find((cc) => cc.id_product == this.productToCart.id) as CartContent).id_customer,
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
        this.showEditCartDialog = false;
        if(typeof data==='boolean'){
          if(data==true){
            this.msg.add({
              severity: 'success',
              summary: 'Sucesso!',
              detail: 'Produto atualizado com sucesso ao pedido.'
            });
            this.svcInd.annunceCounter();
            this.loadCartItens();
            //this.getItens();
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

  tryDelete(id:number,idCustomer:number):void{
    this.idToDelete = id;
    this.idCustomerToDelete = idCustomer;
    this.cnf.confirm({
      header:'Confirma exclusão?',
      message:'Deseja realmente prosseguir com a exclusão deste item?',
      accept: () =>{
        this.executeDelete();
      },
      acceptLabel:'Sim',
      acceptIcon:'pi pi-check mr-1',
      acceptButtonStyleClass: 'p-button-sm',
      rejectLabel:'Não',
      rejectIcon:'pi pi-ban mr-1',
      rejectButtonStyleClass:'p-button-danger p-button-sm'
    });
  }

  executeDelete():void{
    // this.isCancel = false;
    this.svcOrd.removeCartItens([this.idToDelete],this.idCustomerToDelete).subscribe({
      next: (data) =>{
        this.msg.clear();
        if(typeof data ==='boolean'){
          this.msg.add({
            severity:'success',
            summary:'Sucesso!',
            detail:'Produto excluído com sucesso!'
          });
          this.loadCartItens();
          //this.getItens();
          this.svcInd.annunceCounter();
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
  
}
