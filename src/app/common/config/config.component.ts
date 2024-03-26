import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})

export class ConfigComponent extends Common implements AfterViewInit{
  title:string = "";
  constructor(route:Router,
    private actRoute: ActivatedRoute,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  ngAfterViewInit(): void {
    this.actRoute.queryParams.subscribe({
      next: (data) =>{
        switch(data['place']){
          case this.modules.CRM.valueOf().toString() : this.title = " do CRM"; break;
          case this.modules.FPR.valueOf().toString(): this.title = " das Devoluções"; break;
          case this.modules.SCM.valueOf().toString(): this.title = " do Calendário"; break;
          case this.modules.B2B.valueOf().toString(): this.title = " do Salesforce"; break;
          default: this.title = "do Sistema"; break;
        }
      }
    });
    this.cdr.detectChanges();

  }

}
