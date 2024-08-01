import { AfterContentInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements AfterContentInit{
  constructor(private route:Router){
    
  }
  
  ngAfterContentInit(): void {
    this.route.navigate(["/orders/management"]);
    // this.route.navigate(["/crm/reports"]);
  }
}
