import { Component,AfterContentInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth, SysConfig } from 'src/app/models/auth.model';
import { SecurityService } from 'src/app/services/security.service';
import { MessageService } from 'primeng/api';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ResponseError } from 'src/app/models/paginate.model';
import { SysService } from 'src/app/services/sys.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone:true,
  imports:[CheckboxModule,
    ButtonModule,
    InputTextModule,
    StyleClassModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    OverlayPanelModule,
    CommonModule],
  providers: [MessageService]
})
export class LoginComponent implements AfterContentInit{
  @ViewChild('pnlRecovery') pnlRecovery:OverlayPanel|null = null;
  config_loading:boolean = false;
  sended:boolean = false;
  loading:boolean = false;
  use_company_custom:boolean = false;
  company_logo:string = "";
  company_name:string = "";
  app_token:Auth = {
    token_access: "",
    token_type: "",
    token_expire: "",
    level_access: "",
    id_user: 0,
    id_profile: 0
  }

  frmLogin = new FormGroup({
    txtUsername: new FormControl('',Validators.required),
    txtPassword: new FormControl('',Validators.required),
    chkRemember: new FormControl()
  });

  email_to_recovery:string = "";

  constructor(
    private svc:SysService,
    private route:Router,
    private authService: SecurityService,
    private messageService: MessageService
  ){
    
  }

  ngAfterContentInit(): void {
    this.config_loading = true;
    //limpa o storage antes de usar o sistema
    localStorage.removeItem("system_pagination_size");
    localStorage.removeItem("use_company_custom");
    localStorage.removeItem("company_name");
    localStorage.removeItem("company_logo");
    localStorage.removeItem("company_instagram");
    localStorage.removeItem("company_facebook");
    localStorage.removeItem("company_linkedin");
    localStorage.removeItem("company_max_up_files");
    localStorage.removeItem("company_max_up_images");
    localStorage.removeItem("company_use_url_images");
    localStorage.removeItem("company_dashboard_color");
    localStorage.removeItem("company_dashboard_image");
    localStorage.removeItem("id_user");
    localStorage.removeItem("token_access");
    localStorage.removeItem("token_type");
    localStorage.removeItem("token_expire");
    localStorage.removeItem("level_access");
    localStorage.removeItem("id_profile");
    localStorage.removeItem("flimv_model");
    //busca as configuracoes do sistema
    this.svc.getConfig().subscribe({
      next:(data) =>{
        if ("system_pagination_size" in data){
          let config:SysConfig = data as SysConfig;
          localStorage.setItem("system_pagination_size",String(config.system_pagination_size));
          localStorage.setItem("use_company_custom",String(config.use_company_custom?1:0));
          localStorage.setItem("company_name",config.company_name);
          localStorage.setItem("company_logo",config.company_logo);
          localStorage.setItem("company_instagram",config.company_instagram);
          localStorage.setItem("company_facebook",config.company_facebook);
          localStorage.setItem("company_linkedin",config.company_linkedin);
          localStorage.setItem("company_max_up_files",String(config.company_max_up_files));
          localStorage.setItem("company_max_up_images",String(config.company_max_up_images));
          localStorage.setItem("company_use_url_images",String(config.company_use_url_images?1:0));
          localStorage.setItem("company_dashboard_image",String(config.company_dashboard_image));
          localStorage.setItem("company_dashboard_color",String(config.company_dashboard_color));
          localStorage.setItem("flimv_model",config.flimv_model);

          this.use_company_custom = config.use_company_custom;
          this.company_logo = config.company_logo;
          this.company_name = config.company_name;
          
          this.config_loading = false;
        }
        else{

        }
      }
    });


    this.frmLogin.controls.txtUsername.setValue(localStorage.getItem("username"));
    this.frmLogin.controls.txtPassword.setValue(localStorage.getItem("password"));
    if(localStorage.getItem("username")!=null){
      this.frmLogin.controls.chkRemember.setValue(true);
    }

    //se houver usuario logado realiza o logoff
    let id = parseInt(String(sessionStorage.getItem("id_user")));
    if(id > 0){
      this.authService.logoff();
    }
  }

  onSubmit():boolean{
    this.sended = this.loading = true;
    if(this.frmLogin.invalid){
      this.loading = false;
      return false;
    }

    let uname:string = this.frmLogin.controls.txtUsername.value as string;
    let paswd:string = this.frmLogin.controls.txtPassword.value as string;
    let chkbx:boolean|null = this.frmLogin.controls.chkRemember.value;

    if(chkbx){
      localStorage.setItem('username',uname);
      localStorage.setItem('password',paswd);
    }else{
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }

    this.authService.tryAuth(
      uname,
      paswd
    ).subscribe({
      next: (data) =>{
        var num:number = data as number;
        var msg:string = "Login ou senha inválidos!";
        this.messageService.clear();
        if (num==0 || num==-1){
          if (num==-1){ msg = "Usuário inexistente ou inativo!"; }
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: msg });
        }else{
          this.app_token = data;
        }
      },
      complete: () => {
        //salva as informacoes do token para verificacao
        localStorage.setItem('token_access',this.app_token.token_access);
        localStorage.setItem('token_type',this.app_token.token_type);
        localStorage.setItem('token_expire',this.app_token.token_expire);

        localStorage.setItem('id_user',String(this.app_token.id_user));
        localStorage.setItem('id_profile',String(this.app_token.id_profile));
        localStorage.setItem("level_access",String(this.app_token.level_access));
        localStorage.setItem("message_renew","1");
        switch(this.app_token.level_access){
          case "A": this.route.navigate(["/admin"]); break;
          case "L": this.route.navigate(["/salesforce"]); break;
          case "I": this.route.navigate(["/salesforce"]); break;
          case "R": this.route.navigate(["/representative"]); break;
        }
        this.loading = false;
      },
      error: (err: Error) => {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Ocorreu um erro ao tentar logar!' });
        this.loading = false;
      }
    })

    return true;
  }

  onRecovery():void{
    this.sended = true;

    if(this.email_to_recovery.trim().length==0 && this.email_to_recovery.indexOf("@")==-1){
      return;
    }

    this.authService.recoveryPassword(this.email_to_recovery).subscribe({
      next:(data) =>{
        this.pnlRecovery?.hide();
        this.email_to_recovery = "";
        this.sended = false;
        if(typeof data ==='boolean'){
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Sucesso!', 
            detail: "Caso seu usuário esteja ativo ou exista em nosso banco de dados, você receberá um e-mail com as instruções!" });
        }else{
          this.messageService.add({
            severity:'error',
            summary:'Erro ao tentar enviar o e-mail!',
            detail: (data as ResponseError).error_details
          });
        }
      }
    });
  }
}
