import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../shared.module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone:true,
  imports:[
    SharedModule,
    CommonModule
  ],
  providers:[
    MessageService
  ]
})
export class ProfileComponent {

}
