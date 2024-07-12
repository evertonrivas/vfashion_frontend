import { Component,AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements AfterContentInit{

  constructor(private route:Router){
    
  }

  ngAfterContentInit(): void {
    this.route.navigate(["/calendar/gantt"]);
  }

}
