import { Component,Input,AfterContentInit,OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { SecurityService } from 'src/app/services/security.service';
import { MessageService } from 'primeng/api';
import { ChatService } from 'src/app/services/chat.service';
import { Common } from 'src/app/classes/common';
import { LayoutService } from 'src/app/services/layout.service';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { IndicatorsService } from 'src/app/services/indicators.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone:true,
  providers: [MessageService,ChatService],
  imports:[
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayPanelModule,
    ToastModule,
    RouterModule,
    TooltipModule,
    ButtonModule,
    RippleModule,
    BadgeModule
  ]
})
export class TopbarComponent extends Common implements AfterContentInit,OnDestroy{
  userLevel:string = "";
  authSub:Subscription = new Subscription;
  chatSub:Subscription = new Subscription;
  idTimerLogged:any = 0;
  idTimerMessage:any = 0;
  totalMessages:number = 1;
  totalInCart:number = 0;
  totalDevolution:number = 0;

  profileSidebarVisible:boolean = false;

  constructor(private svc:SecurityService,
    private msgSvc:MessageService,
    private chatSvc:ChatService,
    private laySvc:LayoutService,
    private IndSvc:IndicatorsService,
    route:Router
    ){
      super(route);
      this.IndSvc.counterAnnounced$.subscribe(() =>{
        this.IndSvc.b2bTotalCart(
          parseInt((localStorage.getItem("id_profile") as string)),
          this.level_access as string
        ).subscribe({
          next: (data) =>{
            if(typeof data ==='number'){
              this.totalInCart = data as number;
            }
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  showProfileSidebar():void{
    this.profileSidebarVisible = !this.profileSidebarVisible;
  }

  ngAfterContentInit(): void {
    this.checkLogged();
    this.idTimerLogged = <any>setInterval(() =>{
      this.checkLogged();
    },30000);//verifica a cada 30 segundos

    //busca o total de produtos do carrinho
    this.IndSvc.b2bTotalCart(
      parseInt((localStorage.getItem("id_profile") as string)),
      this.level_access as string
    ).subscribe({
      next: (data) =>{
        if(typeof data === 'number'){
          this.totalInCart = data as number;
        }
      }
    });

    this.IndSvc.b2bTotalDevolution(
      parseInt((localStorage.getItem("id_profile") as string)),
      this.level_access as string
    ).subscribe({
      next: (data) =>{
        if (typeof data ==='number'){
          this.totalDevolution = data as number;
        }
      }
    })

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
      localStorage.removeItem("id_user");
      localStorage.removeItem("token_access");
      localStorage.removeItem("token_type");
      localStorage.removeItem("token_expire");
      localStorage.removeItem("level_access");
      localStorage.removeItem("id_profile");
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
