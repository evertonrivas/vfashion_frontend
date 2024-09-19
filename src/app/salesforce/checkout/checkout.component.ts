import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { CartContent, CartItem, CartSize, PaymentCondition } from 'src/app/models/order.model';
import { ResponseError } from 'src/app/models/paginate.model';
import { Product,Image, ProductStock, SubTotal, ProductStockSizes, Color } from 'src/app/models/product.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers:[ConfirmationService,MessageService]
})
export class CheckoutComponent extends Common implements AfterViewInit{
  myTotalItens:number = 0;
  myTotalPayment:number = 0;
  cart_itens!:CartContent[];
  idToDelete:number = 0;
  idCustomerToDelete:number = 0;
  isCancel:boolean = false;

  //edicao de produto
  productToCart!:Product;
  showEditCartDialog:boolean = false;
  productToCartImage!:Image;
  productToCartStock!:ProductStock[];
  productToCartSubtotal:SubTotal = {};

  paymentCondition:PaymentCondition[] = [];
  selectedPaymentCondition!:PaymentCondition;

  STK!:ProductStock[]; //necessario para obter o estoque do produto

  //monta na tela os tamanhos dos produtos
  sizeKeys:string[] = [];

  constructor(private svcOrd:B2bOrderService,
    private cnf:ConfirmationService,
    private svcInd:IndicatorsService,
    private msg:MessageService,
    route:Router){
      super(route);
  }

  ngAfterViewInit(): void {
    this.getItens();
    this.getPaymentConditions();
  }

  getPaymentConditions():void{
    this.svcOrd.listPayment({page:1,pageSize:1,query:'can:list-all 1||is:order-by name'}).subscribe({
      next: (data) =>{
        this.paymentCondition = data as PaymentCondition[];
      }
    });
  }

  getItens():void{
    this.myTotalPayment = 0;
    this.myTotalItens   = 0;
    this.svcOrd.listMyItens(
      parseInt(localStorage.getItem('id_profile') as string),
      this.level_access as string
    ).subscribe({
      next: (data) =>{
        this.cart_itens = data as CartContent[];       
        this.cart_itens.forEach((ct) =>{
          this.myTotalPayment += ct.total_price;
          ct.colors.forEach((c) =>{
            c.sizes.forEach((s) =>{
              this.myTotalItens += s.quantity;
              if (this.sizeKeys.find(function(v){
                return s.name==v
              })==undefined){
                this.sizeKeys.push(s.name);
              }
            });
          })
        });
      }
    });
  }

  sumByColor(sizes:CartSize[]){
    let total = 0;
    sizes.forEach((sz:CartSize) =>{
      total += sz.quantity;
    });

    return total;
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
      rejectLabel:'Não',
      rejectIcon:'pi pi-ban mr-1',
      rejectButtonStyleClass:'p-button-danger'
    });
  }

  executeDelete():void{
    this.isCancel = false;
    this.svcOrd.removeCartItens([this.idToDelete],this.idCustomerToDelete).subscribe({
      next: (data) =>{
        this.msg.clear();
        if(typeof data ==='boolean'){
          this.msg.add({
            severity:'success',
            summary:'Sucesso!',
            detail:'Produto excluído com sucesso!'
          });
          this.getItens();
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

  tryCancel():void{
    this.isCancel = true;
    this.cnf.confirm({
      header:'Confirmação de cancelamento',
      message: 'Atenção, essa ação irá realizar o cancelamento total do pedido. Deseja realmente continuar?',
      accept:() =>{
        let profile:number = parseInt(localStorage.getItem("id_profile") as string);

        //nao havendo um profile associado significa que eh administrador
        this.svcOrd.cancelCart(
          this.level_access==this.levels.ADMIN?parseInt(localStorage.getItem("id_user") as string):profile,
          this.level_access as string
        ).subscribe({
          next: (data) =>{
            this.msg.clear();
            if(typeof data ==='boolean'){
              if(data==true){
                this.msg.add({
                  severity:'success',
                  summary:'Sucesso!',
                  detail:'Pedido cancelado com sucesso.',
                });
              }else{
                this.msg.add({
                  severity:'error',
                  summary: 'Erro!',
                  detail:'Ocorreu um erro ao tentar cancelar o pedido.'
                });
              }
            }else{
              this.msg.add({
                severity:"error",
                summary:'Problema!',
                detail: (data as ResponseError).error_details
              })
            }
          }
        })
      },
      acceptLabel:'Sim',
      acceptIcon:'pi pi-check mr-1',
      rejectLabel:'Não',
      rejectIcon:'pi pi-ban mr-1',
      rejectButtonStyleClass:'p-button-danger'
    });
  }

  checkCancel():void{
    if(this.isCancel){
      this.svcInd.annunceCounter();
      this.route.navigate([this.modulePath+'/grid']);
    }
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
        this.productToCartStock = data as ProductStock[];
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
              price_pos: null,
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
              
              this.changeAndSum(cl.id);
            });
          }
        });
      }
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
            this.getItens();
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

  testFinishOrder(){
    this.hasSended = true;
    if(this.selectedPaymentCondition==undefined){
      return;
    }

    this.cnf.confirm({
      header:'Confirmar',
      message:'Atenção, todo(s) o(s) cliente(s) irá(ão) ter a mesma condição de pagamento, deseja realmente continuar?',
      accept:() =>{
        this.finishOrder();
      },
      acceptLabel:'Sim',
      acceptIcon:'pi pi-check mr-1',
      rejectLabel:'Não',
      rejectIcon:'pi pi-ban mr-1',
      rejectButtonStyleClass:'p-button-danger'
    });
  }

  finishOrder(){
    this.isCancel = true; //flag apenas para voltar a pagina inicial
    this.hasSended = true;
    if(this.selectedPaymentCondition==undefined){
      return;
    }

    let customers:number[] = [];
    this.cart_itens.forEach((cc) =>{
      if (customers.indexOf(cc.id_customer)==-1){
        customers.push(cc.id_customer); 
      }
    });

    let pay:PaymentCondition = (this.selectedPaymentCondition as PaymentCondition);

    this.svcOrd.finishOrder(
      pay.id,
      customers,
      this.myTotalPayment,
      pay.installments,
      (this.myTotalPayment/pay.installments),
      this.myTotalItens,
      this.level_access
    ).subscribe({
      next: (data) =>{
        if(typeof data ==='boolean'){
          this.msg.clear();
          this.msg.add({
            severity:'success',
            summary:'Sucesso!',
            detail:'Pedido realizado com sucesso!'
          });
        }else{

        }
      }
    })
  }
}
