import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'app-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {

  currentSender: string = "Nate Ricks";
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();
  sender: 'Aaron H.';

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const msgId = '99';
    const msgSubject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;

    const msgSender = this.sender;
    const newMessage = new Message(msgId, msgSubject, msgText, msgSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.msgTextInputRef.nativeElement.value = "";
  }

}
