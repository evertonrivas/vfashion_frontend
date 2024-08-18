import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contactType',
  standalone: true
})
export class ContactTypePipe implements PipeTransform {

  transform(value: string): string {
    const type = value;
    let vReturn = "";
    switch(type){
      case 'E': vReturn = "E-mail"; break;
      case 'P': vReturn = "Telefone Convencional"; break;
      case 'C': vReturn = "Telefone Celular/Móvel"; break;
      case 'F': vReturn = "Facebook"; break;
      case 'I': vReturn = "Instagram"; break;
      case 'L': vReturn = "Linkedin"; break;
      case 'O': vReturn = "Outro Social"; break;
      case 'W': vReturn = "Website"; break;
    }
    return vReturn;
  }

}
