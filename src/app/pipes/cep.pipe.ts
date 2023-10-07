import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cep'
})
export class CepPipe implements PipeTransform {

  transform(value: string|number|null|undefined): string|null {
    if(value!=null || value!=undefined){
      return value.toString().substring(0,5)+"-"+value.toString().substring(6,3);
    }
    return null;
  }

}
