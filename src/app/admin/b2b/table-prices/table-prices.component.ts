import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-table-prices',
  standalone: true,
  imports: [
    PanelModule,
    TooltipModule,
    ButtonModule
  ],
  templateUrl: './table-prices.component.html',
  styleUrl: './table-prices.component.scss'
})
export class TablePricesComponent {

}
