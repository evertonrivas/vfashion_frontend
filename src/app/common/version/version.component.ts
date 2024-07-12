import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { Common } from 'src/app/classes/common';

@Component({
  selector: 'app-version',
  standalone: true,
  imports: [
    CardModule
  ],
  templateUrl: './version.component.html',
  styleUrl: './version.component.scss'
})
export class VersionComponent extends Common{
  constructor(route:Router){
    super(route)
  }

}
