import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  currentSender: string = 'Bro Stevenson';
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;

  @Output() addMessageEvent = new EventEmitter<Message>();

  constructor() { }

  ngOnInit(): void {
  }

  onSendMessage() {
    const msgSubject = this.subjectInputRef.nativeElement.value;
    const msgText = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message("1", msgSubject, msgText, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = "";
    this.msgTextInputRef.nativeElement.value = "";
  }

}
