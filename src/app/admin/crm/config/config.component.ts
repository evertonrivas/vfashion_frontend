import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FunnelStage } from 'src/app/models/crm.model';
import { ResponseError } from 'src/app/models/paginate.model';
import { CrmConfigKeys } from 'src/app/models/system.enum';
import { CrmService } from 'src/app/services/crm.service';

export interface Config{
  [index:string]: string
}

@Component({
  selector: 'app-config',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
  ],
  providers:[
    MessageService, ConfirmationService
  ],
  templateUrl: './config.component.html',
  styleUrl: './config.component.scss'
})
export class ConfigComponent extends Common implements AfterViewInit{
  all_funnel_stage:FunnelStage[] = [];
  selected_stages:FunnelStage[] = [];
  configs:Config = {};
  constructor(route:Router,
    private msg:MessageService,
    private cnf:ConfirmationService,
    private svc:CrmService,
    private cdr:ChangeDetectorRef
  ){
    super(route);
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.options.query = "can:list-all 1||is:sales 1||";
    this.svc.listStages(this.options).subscribe({
      next:(data) =>{
        this.all_funnel_stage = data as FunnelStage[];
      }
    });

    this.svc.loadConfig().subscribe({
      next: (data) =>{
        this.configs = data as Config;
        this.loading = false;
        Object.keys(this.configs).forEach(k =>{
          if(k==CrmConfigKeys.DEFAULT_FUNNEL_STAGES){
            let keys = this.configs[k].split(",")
            keys.forEach(ix =>{
              let fs:FunnelStage = this.all_funnel_stage.find(v => v.id == parseInt(ix)) as FunnelStage;
              this.selected_stages.push(fs);
            })
          }
        });
      }
    });
    this.cdr.detectChanges();
  }

  doSave():void{
    let stages:number[] = [];
    this.selected_stages.forEach(s =>{
      stages.push(s.id)
    });

    this.configs[CrmConfigKeys.DEFAULT_FUNNEL_STAGES] = stages.join(",");

    this.svc.saveConfig(this.configs).subscribe({
      next: (data) =>{
        if(typeof data ==='boolean'){
          this.msg.add({
            summary:"Sucesso...",
            detail: "Configuração salva com sucesso!",
            severity:"success"
          });
        }else{
          this.msg.add({
            summary:"Falha...",
            detail: "Ocorreu o seguinte:"+(data as ResponseError).error_details,
            severity:"error"
          });
        }
      }
    });
  }
}
