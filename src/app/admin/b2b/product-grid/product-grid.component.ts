import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";

@Component({
    selector: 'app-product-grid',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './product-grid.component.html',
    styleUrl: './product-grid.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class ProductGridComponent extends Common implements AfterViewInit{
  constructor(route:Router){
    super(route)
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  

}
