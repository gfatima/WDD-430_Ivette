import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Client } from '../client.model';
import { ClientService } from '../client.service';

@Component({
  selector: 'fitCamp-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.css'],
})

export class ClientDetailComponent implements OnInit {
  client: Client | null;
  id: string;

  constructor(
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params
    .subscribe(
      (params: Params) => {
      this.id = params['id'];
      this.client = this.clientService.getClient(this.id);
    });
  }

  onDelete() {
    if (this.client) {
      this.clientService.deleteClient(this.client);
      this.router.navigate(['/clients/']);
    }
  }
}
