import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent {
  @Input() ComponentSize:number = 0;
  @Input() ComponentColor:string = "";
  @Input() ComponentCollection:string | null = null;
  @Input() ComponentBrand:string|null = null;
  @Input() ComponentDateStart:string|null = null;
  @Input() ComponentDateEnd: string|null = null;
  @Input() isMilestone:boolean = false;
  constructor(){}
}
