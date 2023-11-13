import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { CartContent, CartSize } from 'src/app/models/order.model';
import { ResponseError } from 'src/app/models/paginate.model';
import { B2bOrderService } from 'src/app/services/b2b.order.service';

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

  //monta na tela os tamanhos dos produtos
  sizeKeys:string[] = [];

  constructor(private svcOrd:B2bOrderService,
    private cnf:ConfirmationService,
    private msg:MessageService,
    route:Router){
      super(route);
  }

  ngAfterViewInit(): void {
    this.getItens();
  }

  getItens():void{
    let priceByProduct:number = 0;
    this.svcOrd.listMyItens(
      parseInt(localStorage.getItem('id_profile') as string),
      localStorage.getItem("level_access") as string
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
    console.log(this.idToDelete);
    this.svcOrd.delete([this.idToDelete],this.idCustomerToDelete).subscribe({
      next: (data) =>{
        this.msg.clear();
        if(typeof data ==='boolean'){
          this.msg.add({
            severity:'success',
            summary:'Sucesso!',
            detail:'Produto excluído com sucesso!'
          });
          this.getItens();
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
    this.cnf.confirm({
      header:'Confirma cancelamento?',
      message: 'Atenção, essa ação irá realizar o cancelamento total do pedido. Deseja realmente continuar?',
      accept:() =>{

      },
      acceptLabel:'Sim',
      acceptIcon:'pi pi-check mr-1',
      rejectLabel:'Não',
      rejectIcon:'pi pi-ban mr-1',
      rejectButtonStyleClass:'p-button-danger'
    });
  }
}
