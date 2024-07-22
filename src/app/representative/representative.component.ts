import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-representative',
  templateUrl: './representative.component.html',
  styleUrl: './representative.component.scss'
})
export class RepresentativeComponent implements AfterContentInit{
  constructor(private route:Router){
    
  }
  
  ngAfterContentInit(): void {
    this.route.navigate(["/representative/orders"]);
    // this.route.navigate(["/crm/reports"]);
  }
}
