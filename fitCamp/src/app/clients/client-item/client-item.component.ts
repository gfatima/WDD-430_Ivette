import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Client } from '../client.model';

@Component({
  selector: 'fitCamp-client-item',
  templateUrl: './client-item.component.html',
  styleUrls: ['./client-item.component.css']
})

export class ClientItemComponent implements OnInit {

  @Input()  client: Client;
  @Output() selectedClient = new EventEmitter<void>();

  constructor() { }

  onSelected() {
    this.selectedClient.emit();
  }

  ngOnInit() : void{
  }

}
