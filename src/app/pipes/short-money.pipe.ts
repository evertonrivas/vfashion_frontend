import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortMoney'
})
export class ShortMoneyPipe implements PipeTransform {

  transform(value: number|null): unknown {
    if (value==null){
      return null;
    }
    const ranges =[
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    for (let i = ranges.length - 1; i >= 0; i--) {
      if (value >= ranges[i].value) {
        const scaledValue = value / ranges[i].value;
        const suffix = ranges[i].symbol;
        return scaledValue.toFixed(1) + suffix;
      }
    }

    return value.toString();
  }

}
