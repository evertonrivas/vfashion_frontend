import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'entityType'
})
export class EntityTypePipe implements PipeTransform {

  transform(value: string): string {
    const eType = value;
    let vReturn = "";
    
    switch(eType){
      case 'C': vReturn = "Cliente"; break;
      case 'R': vReturn = "Representante"; break;
      case 'F': vReturn = "Fornecedor"; break;
      case 'P': vReturn = "Pessoa (Física)"; break;
    }

    return vReturn;
  }

}
