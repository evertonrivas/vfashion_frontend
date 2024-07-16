import { AfterViewInit, Component } from '@angular/core';
import { Common } from '../classes/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devolution',
  templateUrl: './devolution.component.html',
  styleUrls: ['./devolution.component.scss']
})
export class DevolutionComponent extends Common implements AfterViewInit{
  constructor(route:Router){
    super(route)
  }

  ngAfterViewInit(): void {
    this.route.navigate([this.modulePath+"/process"]);
  }
}
