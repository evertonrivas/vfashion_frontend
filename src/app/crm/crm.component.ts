import { Component,AfterContentInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crm',
  templateUrl: './crm.component.html',
  styleUrls: ['./crm.component.scss']
})
export class CrmComponent implements AfterContentInit {
  constructor(private route:Router){
    
  }
  
  ngAfterContentInit(): void {
    this.route.navigate(["/crm/kanban"]);
    // this.route.navigate(["/crm/reports"]);
  }
}
