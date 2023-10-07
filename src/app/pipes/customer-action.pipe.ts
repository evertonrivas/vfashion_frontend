import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customerAction'
})
export class CustomerActionPipe implements PipeTransform {

  transform(value: string): string {
    const act = value;
    let vReturn = "";

    switch(act){
      case 'DR': vReturn = "Registro de Dados"; break;
      case 'DU': vReturn = "Atualização de Dados"; break;
      case 'DD': vReturn = "Exclusão de Dados"; break;
      case 'MC': vReturn = "Movimento de Funil/Estágio"; break;
      case 'CS': vReturn = "Enviou de mensagem"; break;
      case 'CR': vReturn = "Recebeu de mensagem"; break;
      case 'OC': vReturn = "Pedido criado"; break;
      case 'OU': vReturn = "Pedido atualizado"; break;
      case 'OD': vReturn = "Pedido excluído"; break;
      case 'SA': vReturn = "Acesso ao sistema"; break;
      case 'TA': vReturn = "Tarefa Criada"; break;
      case 'FA': vReturn = "Arquivo anexado"; break;
      case 'FD': vReturn = "Arquivo excluído"; break;
      case 'ES': vReturn = "E-mail enviado"; break;
      case 'ER': vReturn = "E-mail respondido"; break;
      case 'RC': vReturn = "Devolução criada"; break;
      case 'RU': vReturn = "Devolução atualizada"; break;
      case 'FB': vReturn = "Bloqueio financeiro"; break;
      case 'FU': vReturn = "Desbloqueio financeiro"; break;
    }

    return vReturn;
  }

}
