import { Component, OnInit } from '@angular/core';
import { Client } from './client.model';
import { ClientService } from './client.service';

@Component({
  selector: 'fitCamp-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})

export class ClientsComponent implements OnInit {

  selectedClient!: Client;

  constructor(private clientService: ClientService) { }

  ngOnInit(): void{
    this.clientService.clientSelectedEvent.subscribe(
      (client: Client) => {
        this.selectedClient = client;
      }
      );
  }

}
