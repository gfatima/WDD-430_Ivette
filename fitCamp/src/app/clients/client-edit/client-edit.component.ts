import { Client } from 'src/app/clients/client.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ClientService } from '../client.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'fitCamp-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css'],
})

export class ClientEditComponent implements OnInit {
  originalClient: Client | null = null;
  client!: Client;
  groupClients: Client[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe (
      (params: Params) => {
        let id = +params['id'];
        if (id == undefined || id == null) {
          this.editMode = false
          return
        }
        this.originalClient = this.clientService.getClient(id.toString())

        if (this.originalClient == undefined || this.originalClient == null) {
          return
        }
        this.editMode = true
        this.client = JSON.parse(JSON.stringify(this.originalClient))
        if (this.client.group) {

            this.groupClients = JSON.parse(JSON.stringify(this.originalClient.group))
          }
      });
  }

  onCancel() {
    this.router.navigate(['clients']);
  }

  isInvalidclient(newClient: Client) {
    if (!newClient)
      return true;
    if (this.client && newClient.id === this.client.id)
      return true;
    for (let i = 0; i < this.groupClients.length; i++) {
      if (newClient.id === this.groupClients[i].id)
        return true;
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedClient: Client = $event.dragData;
    const invalidGroupclient = this.isInvalidclient(selectedClient);
    if (invalidGroupclient) {
      return;
    }
    this.groupClients.push(selectedClient);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupClients.length)
      return;
    this.groupClients.splice(index, 1);
   }

   onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newclient = new Client(value['id'], value['name'], value['email'], value['phone'], value['imageUrl'], this.groupClients)
    if (this.editMode == true) {
      this.clientService.updateClient(this.originalClient!, newclient)
    }

    else {
      console.log(newclient)
      this.clientService.addClient(newclient)
    }
    this.onCancel();
  }

  drop(event: CdkDragDrop<string[]>) {

    const previousIndex = event.previousIndex;
    const clientsArray = event.previousContainer.data;
    const selectedClient: Client = JSON.parse(JSON.stringify(clientsArray[previousIndex]));

    if(!selectedClient) {
      return;
    }
    if(this.originalClient) {
      if(selectedClient.id === this.originalClient.id) {
        return;
      }
    }
    for (let i = 0; i < this.groupClients.length; i++) {
      if(selectedClient.id === this.groupClients[i].id) {
        return;
      }
    }

    this.groupClients.push(selectedClient);
    console.log(this.groupClients);
  }
}
