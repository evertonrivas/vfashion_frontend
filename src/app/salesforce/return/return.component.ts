import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Common } from 'src/app/classes/common';

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})
export class ReturnComponent extends Common implements AfterViewInit{

  constructor(route:Router){
    super(route);
  }

  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  
}
