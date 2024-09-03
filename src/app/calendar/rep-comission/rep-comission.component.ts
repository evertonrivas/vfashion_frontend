import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';

@Component({
  selector: 'app-rep-comission',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  templateUrl: './rep-comission.component.html',
  styleUrl: './rep-comission.component.scss',
  providers:[MessageService, ConfirmationService]
})
export class RepComissionComponent extends Common implements AfterViewInit{

  constructor(route:Router){
    super(route)
  }
  
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

}
