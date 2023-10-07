import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
  standalone:true,
  imports: [RouterModule, ButtonModule, ToastModule],
  providers: [MessageService]
})
export class SelectorComponent {
  authSub:Subscription = new Subscription;

  constructor(private svc:SecurityService,
    private msgSvc:MessageService){

  }
  
  checkLogged():void{
    this.authSub = this.svc.checkLogged().subscribe({
      next: data => {
        if (data==false){
          document.location.href="/";
        }else{
          let dt_token = Date.parse( String(localStorage.getItem('token_expire')) );
          let now = Date.now();
          const diffTime = Math.abs(dt_token - now);
          if(diffTime<=300000){//5 minutos
            
            if(localStorage.getItem("message_renew")=="1"){
              this.msgSvc.clear();
              this.msgSvc.add({
                key:'sessionToast',
                closable:false,
                severity:'info',
                summary: 'Deseja renovar a sessão?',
                detail: 'Sua sessão será renovada por 1 hora',
                sticky: true,
                life: 5000
              });
            }
          }
        }
      },
      error:() =>{
        document.location.href="/";
      }
    });
  }

  renewSession():void{
    this.msgSvc.clear();
    this.svc.renewSession().subscribe({
      next: (data) =>{
        if((data as boolean) !== false){
          localStorage.setItem('token_expire',data as string);
          this.msgSvc.add({ key:'sessionRenew',severity:'success',summary:'Sessão renovada com sucesso!'});
        }else{
          this.msgSvc.add({ key:'sessionRenew',severity:'error',summary:'Ocorreu um erro ao tentar renovar a sessão!'});
        }
      }
    });
  }

  dontRenew():void{
    localStorage.setItem("message_renew","0");
    this.msgSvc.clear();
  }
}
