import { CommonModule } from '@angular/common';
import { Component,Input,OnChanges } from '@angular/core';
import { SharedModule } from 'src/app/common/shared.module';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { Card, SubtitleCard } from 'src/app/models/card.model';

export enum FormatType{
  MONEY  = 0,
  NUMBER = 1,
  TEXT   = 2,
  HTML   = 3
}

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  imports: [SkeletonModule,CardModule,CommonModule,SharedModule],
  standalone:true,
})
export class CardComponent implements OnChanges{
  @Input() loading:boolean = false;
  @Input() card:Card|null = null;
  arrow_down:boolean = false;
  arrow_up:boolean = false;
  percent:number = 0;

  constructor(){

  }
  
  ngOnChanges():void{
    this.arrow_down = false;
    this.arrow_up   = false;
    this.percent    = 0;
    if ((this.card?.value as number) > (this.card?.subtitle?.prefix as number)){
      this.arrow_up = true;
      this.percent = (((this.card?.value as number)/(this.card?.subtitle?.prefix as number))-1)*100;
    }
    if ((this.card?.value as number) < (this.card?.subtitle?.prefix as number)){
      this.arrow_down = true;
      this.percent = ((((this.card?.subtitle?.prefix as number)/(this.card?.value as number))-1)*100);
    }
  }
}
