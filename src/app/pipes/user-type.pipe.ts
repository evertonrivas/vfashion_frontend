import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userType'
})
export class UserTypePipe implements PipeTransform {

  transform(value: string): string {
    const eType = value;
    let vReturn = "";
    
    switch(eType){
      case 'A': vReturn = 'Administrador'; break;
      case 'L': vReturn = 'Lojista'; break;
      case 'R': vReturn = 'Representante'; break;
      case 'C': vReturn = 'Usuário do Sistema'; break;
      case 'V': vReturn = 'Vendedor'; break;
    }

    return vReturn;
  }

}