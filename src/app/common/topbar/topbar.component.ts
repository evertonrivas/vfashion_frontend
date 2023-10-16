import { Component,Input,AfterContentInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { MessageService } from 'primeng/api';
import { ChatService } from 'src/app/services/chat.service';
import { Common } from 'src/app/classes/common';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  providers: [MessageService,ChatService]
})
export class TopbarComponent extends Common implements AfterContentInit,OnDestroy{
  userLevel:string = "";
  authSub:Subscription = new Subscription;
  chatSub:Subscription = new Subscription;
  idTimerLogged:any = 0;
  idTimerMessage:any = 0;
  totalMessages:number = 1;

  constructor(private svc:SecurityService,
    private msgSvc:MessageService,
    private chatSvc:ChatService,
    private laySvc:LayoutService,
    route:Router
    ){
      super(route)
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  ngAfterContentInit(): void {
    this.userLevel = localStorage.getItem("level_access") as string;
    this.checkLogged();
    this.idTimerLogged = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos

    this.chatSub = this.chatSvc.chatAnnounced$.subscribe({
      next(value) {
        
      },
      error(err) {
        
      },
      complete() {
        
      },
    });
  }

  checkMessage():void{

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

  onLogoff():void{
    this.svc.logoff().subscribe(() =>{
      this.route.navigate(["/"]);
    });
  }

  onMenu():void{
    this.laySvc.onMenuToggle();
  }

  onCart():void{
    this.laySvc.onCartToggle();
  }
}
