import { Injectable } from '@angular/core';
import { MyHttp } from './my-http';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService extends MyHttp{
  private chatAnnounced = new Subject<Chat>();

  chatAnnounced$ = this.chatAnnounced.asObservable();

  constructor(http:HttpClient) { 
    super(http);
  }

  annouceChat(msg:Chat):void{
    this.chatAnnounced.next(msg);
  }

  sendMessage():Observable<boolean>{
    return new Observable<boolean>();
  }


}
