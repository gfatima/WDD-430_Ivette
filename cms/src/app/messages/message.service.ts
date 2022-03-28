import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  @Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  messageListChangedEvent = new Subject<Message[]>();

  messages: Message[] = [];
  maxMessageId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData()
  }

  getMessages() {
    return this.messages.slice();
  }

  getMessage(id: string){
    for (let i = 0; i < this.messages.length; i++) {
      if (this.messages[i].id === id) {
        return this.messages[i];
      }
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

  getDatabaseData() {
    this.http
      .get<Message[]>(
        'http://localhost:3000/messages'
      )
      .subscribe({
        next: (messagesList: Message[]) => {
          this.messages = messagesList;
          this.maxMessageId = this.getMaxId();
          this.messages = this.messages.sort((a, b) => (a.id < b.id) ? 1 : (a.id > b.id) ? -1 : 0);
          this.messageListChangedEvent.next(this.messages.slice());
        },
        error: (error: any) => {
          console.log(error);
        },
      });
  }

  storeMessages() {
    const docs = JSON.stringify(this.messages);
    this.http
      .put(
        'http://localhost:3000/messages',
        docs
      )
      .subscribe(response => {
        console.log(response);
        this.messageListChangedEvent.next(this.messages.slice());
      });
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }

    // make sure id of the new message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ statusMessage: string, message: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.messages.push(responseData.message);
          this.storeMessages();
        }
      );
  }

  updateMessage(originalMessage: Message, newMessage: Message) {
    if (!originalMessage || !newMessage) {
      return;
    }

    const pos = this.messages.indexOf(originalMessage);

    if (pos < 0){
      return;
    }

    newMessage.id = originalMessage.id;

    // update database
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    this.http.put<any>('http://localhost:3000/messages/' + originalMessage.id, newMessage, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.messages[pos] = newMessage;
          this.storeMessages();
          //this.messageListChangedEvent.next(this.messages.slice());
        }
      );
  }

  deleteMessage(message: Message) {

    if (!message){
      return;
    }

    const position = this.messages.indexOf(message);

    if (position < 0){
       return;
    }

    // delete from database
    this.http.delete<any>('http://localhost:3000/messages/' + message.id)
      .subscribe(
        (response: Response) => {
          this.messages.splice(position, 1);
          this.storeMessages();
         // this.messageListChangedEvent.next(this.messages.slice());
        }
      );
  }
}
