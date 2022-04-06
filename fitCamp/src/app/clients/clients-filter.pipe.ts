import { Pipe, PipeTransform } from '@angular/core';
import { Client } from './client.model';

@Pipe({
  name: 'clientsFilter'
})
export class ClientsFilterPipe implements PipeTransform {


  transform(clients: Client[], term: string) {
    let filteredClients: Client[] =[];
    if (term && term.length > 0) {
       filteredClients = clients.filter(
          (client:Client) => client.name.toLowerCase().includes(term.toLowerCase())
       );
    }
    if (filteredClients.length < 1){
       return clients;
    }
    return filteredClients;
 }
}
