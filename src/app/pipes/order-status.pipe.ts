import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../models/system.enum';

@Pipe({
  name: 'orderStatus',
  standalone: true
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: number): string {
    const eType = value;
    let vReturn = "";

    switch(eType){
      case OrderStatus.SENDED: vReturn = "Enviado"; break;
      case OrderStatus.ANALIZING: vReturn = "Em análise"; break;
      case OrderStatus.PROCESSING: vReturn = "Em processamento"; break;
      case OrderStatus.TRANSPORTING: vReturn = "Em transporte"; break;
      case OrderStatus.FINISHED: vReturn = "Finalizado"; break;
      case OrderStatus.REJECTED: vReturn = "Recusado"; break
    }

    return vReturn;
  }

}
