import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/common/shared.module';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent {

}
