import { CommonModule, CurrencyPipe } from '@angular/common';
import { ChangeDetectorRef, Component,Input,OnChanges } from '@angular/core';
import { SharedModule } from 'src/app/common/shared.module';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Card, FormatType, SubtitleCard } from 'src/app/models/card.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [SkeletonModule,CardModule,CommonModule,SharedModule],
  providers: [CurrencyPipe],
  standalone:true,
})
export class CardComponent implements OnChanges{
  @Input() loading:boolean = false;
  @Input() card:Card|null = null;
  arrow_down:boolean = false;
  arrow_up:boolean = false;
  number:number = 0;
  type = FormatType;

  constructor(private cdr:ChangeDetectorRef, private pipe: CurrencyPipe){
    
  }
  
  ngOnChanges():void{
    this.arrow_down = false;
    this.arrow_up   = false;
    if ((this.card?.value as number) > (this.card?.subtitle?.prefix as number)){
      this.arrow_up = true;
      this.number = (((this.card?.value as number)/(this.card?.subtitle?.prefix as number))-1)*100;
    }
    if ((this.card?.value as number) < (this.card?.subtitle?.prefix as number)){
      this.arrow_down = true;
      this.number = ((((this.card?.subtitle?.prefix as number)/(this.card?.value as number))-1)*100);
    }
    this.cdr.detectChanges();
    // console.log("netrou",this.card?.subtitle?.prefix);
  }
}
