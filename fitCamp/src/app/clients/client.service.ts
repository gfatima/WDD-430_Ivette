import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Client } from './client.model';

@Injectable({
  providedIn: 'root',
})

export class ClientService {
  clientSelectedEvent = new EventEmitter<Client>();
  clientListChangedEvent = new Subject<Client[]>();

  clients: Client[] = [];
  maxClientId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData();
  }

  getClients(): Client[] {
    return this.clients.slice();
  }

  getClient(id: string) {
    for (const client of this.clients) {
      if (client.id == id) return client;
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.clients.length; i++) {
      let currentId: number = parseInt(this.clients[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeClients() {
    const con = JSON.stringify(this.clients);
    this.http
      .put(
        'http://localhost:3000/clients',
        con
      )
      .subscribe((response) => {
        console.log(response);
        this.clientListChangedEvent.next(this.clients.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Client[]>(
        'http://localhost:3000/clients'
      )
      .subscribe({

        error: (error: any) => {
          console.log(error);
        },
        next: (clients: Client[]) => {
          this.clients = clients;
          this.maxClientId = this.getMaxId();
          this.clients = this.clients.sort((a, b) =>
            a.name < b.name ? 1 : a.name > b.name ? -1 : 0
          );
          this.clientListChangedEvent.next(this.clients.slice());
        },
      });
  }

  addClient(client: Client) {
    if (!client) {
      return;
    }

    // make sure id of the new client is empty
    client.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, client: Client }>('http://localhost:3000/clients',
    client,
      { headers: headers })
      .subscribe(
        (responseData) => {

          this.clients.push(responseData.client);
          this.storeClients();
        }
      );
  }
  updateClient(originalClient: Client, newClient: Client) {
    if (!originalClient || !newClient) {
      return;
    }

    const pos = this.clients.findIndex(d => d.id === originalClient.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newClient.id = originalClient.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put<any>('http://localhost:3000/clients/' + originalClient.id,
    newClient, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.clients[pos] = newClient;
          this.storeClients();
        }
      );
  }

  deleteClient(client: Client) {

    if (!client) {
      return;
    }

    const pos = this.clients.findIndex(d => d.id === client.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete<any>('http://localhost:3000/clients/' + client.id)
      .subscribe(
        (response: Response) => {
          this.clients.splice(pos, 1);
          this.storeClients();
        }
      );
  }

}
