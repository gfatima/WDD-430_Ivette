import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'fitCamp-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css'],
})
export class ClientListComponent implements OnInit, OnDestroy {
  clients: Client[] = [];
  subscription: Subscription;
  term: string;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.clients = this.clientService.getClients();
    this.clientService.clientListChangedEvent.subscribe(
      (clients: Client[]) => {
        this.clients = clients;
      }
    );
  }

  onSelected(client: Client) {
    this.clientService.clientSelectedEvent.emit(client);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  search(value: string) {
    this.term = value;
  }

}
