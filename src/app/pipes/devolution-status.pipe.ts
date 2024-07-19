import { Pipe, PipeTransform } from '@angular/core';
import { DevolutionStatus, ModuleName } from '../models/system.enum';

@Pipe({
  name: 'devolutionStatus',
  standalone: true
})
export class DevolutionStatusPipe implements PipeTransform {

  transform(value: number, module:ModuleName = ModuleName.B2B): string {
    const eType = value;
    let vReturn = "";

    if (module==ModuleName.B2B){
      switch(eType){
        case DevolutionStatus.SAVED: vReturn = "Salvo"; break;
        case DevolutionStatus.PENDING: vReturn = "Aguardando análise"; break;
        case DevolutionStatus.APPROVED_ALL: vReturn = "Totalmente aprovado"; break;
        case DevolutionStatus.APPROVED_PART: vReturn = "Parcialmente aprovado"; break;
        case DevolutionStatus.REJECTED: vReturn = "Reprovado"; break
        case DevolutionStatus.FINISHED: vReturn = "Finalizado"; break;
      }
    }else{
      switch(eType){
        case DevolutionStatus.SAVED: vReturn = "Salvo"; break;
        case DevolutionStatus.PENDING: vReturn = "Aguardando avaliação"; break;
        case DevolutionStatus.APPROVED_ALL: vReturn = "Totalmente aprovado"; break;
        case DevolutionStatus.APPROVED_PART: vReturn = "Parcialmente aprovado"; break;
        case DevolutionStatus.REJECTED: vReturn = "Reprovado"; break
      }
    }

    return vReturn;
  }

}
