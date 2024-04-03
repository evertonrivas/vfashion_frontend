import { Component,AfterContentInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from 'src/app/models/auth.model';
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
    CommonModule],
  providers: [MessageService]
})
export class LoginComponent implements AfterContentInit{
  sended:boolean = false;
  loading:boolean = false;
  app_token:Auth = {
    token_access: "",
    token_type: "",
    token_expire: "",
    level_access:"",
    id_user:0,
    id_profile: 0
  }

  frmLogin = new FormGroup({
    txtUsername: new FormControl('',Validators.required),
    txtPassword: new FormControl('',Validators.required),
    chkRemember: new FormControl()
  });

  constructor(
    private route:Router,
    private authService: SecurityService,
    private messageService: MessageService
  ){

  }

  ngAfterContentInit(): void {
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
          this.app_token.token_access = data.token_access;
          this.app_token.token_type   = data.token_type;
          this.app_token.level_access = data.level_access;
          this.app_token.id_user      = data.id_user;
          this.app_token.id_profile   = data.id_profile;
          this.app_token.token_expire = data.token_expire
        }
      },
      complete: () => {
        //salva as informacoes do token para verificacao
        localStorage.setItem('token_access',this.app_token.token_access);
        localStorage.setItem('token_type',this.app_token.token_type);
        localStorage.setItem('id_user',String(this.app_token.id_user));
        localStorage.setItem('id_profile',String(this.app_token.id_profile));
        localStorage.setItem('token_expire',this.app_token.token_expire);
        localStorage.setItem("level_access",String(this.app_token.level_access));
        localStorage.setItem("message_renew","1");
        switch(this.app_token.level_access){
          case "A": this.route.navigate(["/admin"]); break;
          case "L": this.route.navigate(["/salesforce"]); break;
          case "I": this.route.navigate(["/salesforce"]); break;
          case "R": this.route.navigate(["/selector"]); break;
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
}
