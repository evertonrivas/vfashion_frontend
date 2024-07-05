import { HttpHeaders } from '@angular/common/http';
import { Component, Input,EventEmitter,Output, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { FileUploadEvent } from 'primeng/fileupload';
import { Common } from 'src/app/classes/common';
import { EntityContact } from 'src/app/models/entity.model';
import { ResponseError } from 'src/app/models/paginate.model';
import { EmailService } from 'src/app/services/email.service';

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
  content:string = '';
  attachments:string[] = [];
  url_upload:string = this.sysconfig.backend_cmm+'/upload/temp';
  moreThan4:string[] = ["Vários clientes selecionados..."];

  constructor(
    private svc:EmailService,
    private cdr:ChangeDetectorRef,
    route:Router
  ){
    super(route);
  }
  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  sendEmail(){
    this.loading = true;
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

    if(this.subject.trim().length==0 || this.content.trim().length==0){
      return;
    }

    this.svc.send(mailto,this.subject,this.content,this.attachments).subscribe({
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
}
