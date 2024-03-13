import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FilterComponent } from "../../../common/filter/filter.component";

@Component({
    selector: 'app-sizes',
    standalone: true,
    providers: [
        MessageService,
        ConfirmationService
    ],
    templateUrl: './sizes.component.html',
    styleUrl: './sizes.component.scss',
    imports: [
        CommonModule,
        SharedModule,
        FilterComponent
    ]
})
export class SizesComponent extends Common implements AfterViewInit{
  constructor(route:Router){
    super(route);
  }
  
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }

}
