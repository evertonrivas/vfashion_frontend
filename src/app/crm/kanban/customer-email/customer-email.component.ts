import { HttpHeaders } from '@angular/common/http';
import { Component, Input,EventEmitter,Output, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { Common } from 'src/app/classes/common';
import { EntityContact } from 'src/app/models/entity.model';
import { ResponseError } from 'src/app/models/paginate.model';
import { EmailService } from 'src/app/services/email.service';
import { SysService } from 'src/app/services/sys.service';

@Component({
  selector: 'app-customer-email',
  templateUrl: './customer-email.component.html',
  styleUrls: ['./customer-email.component.scss']
})
export class CustomerEmailComponent extends Common implements AfterViewInit{
  @Input() emailToList:EntityContact[] = [];
  @Input() uploadHeaders:HttpHeaders = new HttpHeaders();
  @Input() uploadMax:number = 0;
  @Input() massiveEmail:boolean = false;
  @Output() messageToShow = new EventEmitter<Message>();
  ai_visible:boolean = false;
  ai_loading:boolean = false;
  ai_suggestion_title:string = "";
  ai_suggestion_content:string = "";
  selectedEmail:EntityContact = {
    id: 0,
    id_legal_entity:0,
    name: '',
    contact_type: '',
    value: '',
    is_whatsapp: false,
    is_default: false
  };
  subject:string = '';
  content:any;
  attachments:string[] = [];
  url_upload:string = this.envconfig.backend_cmm+'/upload/temp';
  moreThan4:string[] = ["Vários clientes selecionados..."];

  constructor(
    private svc:EmailService,
    private sSvc:SysService,
    private cdr:ChangeDetectorRef,
    route:Router
  ){
    super(route);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  sendEmail(){
    this.hasSended = true;
    let mailto:string[] = [];
    if(this.massiveEmail){
      this.emailToList.forEach((ct) =>{
        mailto.push(ct.value);
      });
    }else{
      if(this.selectedEmail!=null){
        mailto.push(this.selectedEmail.value);
      }else{
        return;
      }
    }

    if(this.subject.trim().length==0){
      return;
    }
    
    let content:string = "";
    if(typeof(this.content)==='string'){
      content = this.content as string;
    }else{
      content = this.content?.html as string;
    }

    if(content==""){
      return;
    }

    this.loading = true;
    this.svc.send(mailto,this.subject,content,this.attachments).subscribe({
      next: (data) =>{
        this.hasSended = false;
        this.loading = false;
        if(typeof data==='boolean'){
          if((data as boolean)==true){
            this.messageToShow.emit({key:'systemToast',severity:'success',summary:'E-mail enviado com sucesso!'});
          }else{
            this.messageToShow.emit({key:'systemToast',severity:'error',summary:'Não foi possível enviar o e-mail!'});
          }
        }else{
          this.messageToShow.emit({
            key:'systemToast',
            severity:'error',
            summary:'Erro ao tentar enviar o e-mail!',
            detail: (data as ResponseError).error_details
          });
        }
      }
    });
  }

  uploaded(evt:FileUploadEvent):void{
    //nomes dos anexos
    evt.files.forEach((f) =>{
      this.attachments.push(f.name);
    });
  }

  makeAi(obj:any):void{
    let text:string = "";
    if(typeof this.content==='string'){
      text = this.content as string;
    }else{
      text = this.content?.text as string;
    }

    if(text=="" || text==undefined){
      this.messageToShow.emit({
        key:'systemToast',
        severity:'warn',
        summary:'Atenção!',
        detail: "Por favor, informe um texto para que a I.A consiga entender melhor o que deseja."
      })
      return 
    }

    //console.log(obj.target.value)
    if(obj.target.value=="" || obj.target.value==undefined){
      this.messageToShow.emit({
        key:"systemToast",
        severity:"warn",
        summary:"Atenção!",
        detail: "Selecione uma opão válida!"
      });
      return;
    }
    
    this.ai_loading = true;
    this.sSvc.improvementAI(text,obj.target.value).subscribe({
      next:(data) =>{
        this.ai_loading = false;
        this.ai_visible = true;
        this.ai_suggestion_title = data.subject;
        this.ai_suggestion_content = data.content;
      }
    });
  }

  useSuggestion():void{
    this.ai_visible = false;
    this.subject = this.ai_suggestion_title;
    this.content = this.ai_suggestion_content;
  }
}
