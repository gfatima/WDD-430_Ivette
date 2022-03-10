import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  contactSelectedEvent = new EventEmitter<Contact>();
  contactListChangedEvent = new Subject<Contact[]>();

  contacts: Contact[] = [];
  maxContactId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData();
  }

  getContacts() {
    return this.contacts.slice();
  }

  getContact(id: string) {
    for (const contact of this.contacts) {
      if (contact.id == id) return contact;
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.contacts.length; i++) {
      let currentId: number = parseInt(this.contacts[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  storeContacts() {
    const con = JSON.stringify(this.contacts);
    this.http
      .put(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/contacts.json',
        con
      )
      .subscribe((response) => {
        console.log(response);
        this.contactListChangedEvent.next(this.contacts.slice());
      });
  }

  getDatabaseData() {
    this.http
      .get<Contact[]>(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/contacts.json'
      )
      .subscribe({
        // complete: () => {  },
        error: (error: any) => {
          console.log(error);
        },
        next: (contacts: Contact[]) => {
          this.contacts = contacts;
          this.maxContactId = this.getMaxId();
          this.contacts = this.contacts.sort((a, b) =>
            a.name < b.name ? 1 : a.name > b.name ? -1 : 0
          );
          this.contactListChangedEvent.next(this.contacts.slice());
        },
      });
  }

  addContact(newContact: Contact) {
    if (newContact == undefined || newContact == null) {
      return;
    }

    this.maxContactId++;
    newContact.id = String(this.maxContactId);
    this.contacts.push(newContact);
    this.storeContacts();
  }

  updateContact(originalContact: Contact, newContact: Contact) {
    if (originalContact == undefined || originalContact == null) {
      return;
    }
    if (newContact == undefined || newContact == null) {
      return;
    }

    let pos: number = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts();
  }

  deleteContact(contact: Contact) {
    if (!contact) {
      return;
    }

    const pos = this.contacts.indexOf(contact);
    if (pos < 0) {
      return;
    }

    this.contacts.splice(pos, 1);
    this.contactListChangedEvent.next(this.contacts.slice());
    this.storeContacts();
  }
}
