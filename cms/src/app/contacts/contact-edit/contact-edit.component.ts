import { Contact } from 'src/app/contacts/contact.model';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ContactService } from '../contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css'],
})

export class ContactEditComponent implements OnInit {
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: string;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      let id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalContact = this.contactService.getContact(this.id)!;

      if (!this.originalContact){

        this.editMode = false;
        return;
      }

      this.editMode = true;

      this.contact = JSON.parse(JSON.stringify(this.originalContact));

      if (this.contact?.group && this.contact?.group?.length > 0) {
        this.groupContacts = JSON.parse(
          JSON.stringify(this.originalContact.group)
        );
      }
    });
  }

  onCancel() {
    this.router.navigate(['contacts']);
  }

  isInvalidContact(newContact: Contact) {
    if (!newContact)
      return true;
    if (this.contact && newContact.id === this.contact.id)
      return true;
    for (let i = 0; i < this.groupContacts.length; i++) {
      if (newContact.id === this.groupContacts[i].id)
        return true;
    }
    return false;
  }

  addToGroup($event: any) {
    const selectedContact: Contact = $event.dragData;
    const invalidGroupContact = this.isInvalidContact(selectedContact);
    if (invalidGroupContact) {
      return;
    }
    this.groupContacts.push(selectedContact);
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length)
      return;
    this.groupContacts.splice(index, 1);
   }

   onSubmit(form: NgForm) {
    let value = form.value // get values from form’s fields
    let newContact = new Contact(value['id'], value['name'], value['email'], value['phone'], value['imageUrl'], this.groupContacts)
    if (this.editMode == true) {
      this.contactService.updateContact(this.originalContact, newContact)
    }

    else {
      console.log(newContact)
      this.contactService.addContact(newContact)
    }
    this.onCancel();
  }

  drop(event: CdkDragDrop<string[]>) {

    const previousIndex = event.previousIndex;
    const contactsArray = event.previousContainer.data;
    const selectedContact: Contact = JSON.parse(JSON.stringify(contactsArray[previousIndex]));

    if(!selectedContact) {
      return;
    }
    if(this.originalContact) {
      if(selectedContact.id === this.originalContact.id) {
        return;
      }
    }
    for (let i = 0; i < this.groupContacts.length; i++) {
      if(selectedContact.id === this.groupContacts[i].id) {
        return;
      }
    }

    this.groupContacts.push(selectedContact);
    console.log(this.groupContacts);
  }
}
