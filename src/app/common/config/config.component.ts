import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Common } from 'src/app/classes/common';
import { SharedModule } from 'src/app/common/shared.module';
import { FunnelStage } from 'src/app/models/crm.model';
import { CrmConfigKeys } from 'src/app/models/system.enum';
import { CrmService } from 'src/app/services/crm.service';
import { ResponseError } from 'src/app/models/paginate.model';
import { TenantConfig } from 'src/app/models/auth.model';
import { SysService } from 'src/app/services/sys.service';

export interface Config{
  [index:string]: string
}

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
  all_funnel_stage:FunnelStage[] = [];
  selected_stages:FunnelStage[] = [];
  configs:Config = {};
  tenant_config:TenantConfig = {
    ai_model: '',
    ai_api_key: '',
    company_custom: false,
    company_name: '',
    company_logo: '',
    url_instagram: '',
    url_facebook: '',
    url_linkedin: '',
    pagination_size: 0,
    email_brevo_api_key: '',
    email_from_name: '',
    email_from_value: ''
  }
  constructor(route:Router,
    private msg:MessageService,
    private actRoute: ActivatedRoute,
    private sCrm:CrmService,
    private sSys: SysService,
    private cdr:ChangeDetectorRef){
    super(route);
  }

  ngAfterViewInit(): void {
    this.actRoute.queryParams.subscribe({
      next: (data) =>{
        switch(data['place']){
          case this.modules.CRM.valueOf().toString() : {
            this.title = " do CRM";
            this.options.query = "can:list-all 1||is:sales 1||";
                this.sCrm.listStages(this.options).subscribe({
                  next:(data) =>{
                    this.all_funnel_stage = data as FunnelStage[];
                  }
                });
            
                this.sCrm.loadConfig().subscribe({
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
          }; break;
          case this.modules.B2B.valueOf().toString(): this.title = " do Salesforce"; break;
          case this.modules.SCM.valueOf().toString(): this.title = " do Calendário"; break;
          case this.modules.FPR.valueOf().toString(): this.title = " das Devoluções"; break;
          case this.modules.ORD.valueOf().toString(): this.title = " da Gestão de Pedidos"; break;
          case this.modules.SCM.valueOf().toString(): this.title = " do "; break;
          default:{
            this.title = "do Sistema";
            this.sSys.getConfig().subscribe({
              next: (data) =>{
                if("company_name" in data){
                  this.tenant_config = data as TenantConfig;
                }
              }
            })
          }; break;
        }
      }
    });
    this.cdr.detectChanges();

  }

  doSaveCRM():void{
      let stages:number[] = [];
      this.selected_stages.forEach(s =>{
        stages.push(s.id)
      });
  
      this.configs[CrmConfigKeys.DEFAULT_FUNNEL_STAGES] = stages.join(",");
  
      this.sCrm.saveConfig(this.configs).subscribe({
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

    doSaveSysConfig():void{
      this.sSys.saveConfig(this.tenant_config).subscribe({
        next: (data) =>{
          if (typeof data === 'boolean'){
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
