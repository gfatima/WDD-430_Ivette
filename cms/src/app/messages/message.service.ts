import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
 // @Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();

  messages: Message[] = [];
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData()
  }

  getMessages(): Message[] {
    return this.messages.slice();
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id == id) {return message;}
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.messages.length; i++) {
      let currentId: number = parseInt(this.messages[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeMessages() {
    const docs = JSON.stringify(this.messages);
    this.http
      .put(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/messages.json',
        docs
      )
      .subscribe(response => {
        console.log(response);
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Message[]>(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/messages.json'
      )
      .subscribe({
        error: (error: any) => {
          console.log(error);
        },
        next: (messagesList: Message[]) => {
          this.messages = messagesList;
          this.maxMessageId = this.getMaxId();
          this.messages = this.messages.sort((a, b) => (a.id < b.id) ? 1 : (a.id > b.id) ? -1 : 0);
          this.messageListChangedEvent.next(this.messages.slice());
        },
      });
  }

   addMessage(message: Message) {
    this.messages.push(message);
    this.storeMessages()
   }
}
