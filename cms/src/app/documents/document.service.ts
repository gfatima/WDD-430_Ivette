import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class DocumentService {
  @Output() documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();
  documentListChangedEvent = new Subject<Document[]>();

  documents: Document[] = [];
  maxDocumentId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData();
  }

  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string) {
    for (let i = 0; i < this.documents.length; i++) {
      if (this.documents[i].id === id) {
        return this.documents[i];
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.documents.length; i++) {
      let currentId: number = parseInt(this.documents[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDatabaseData() {
    this.http
      .get<Document[]>(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/documents.json'
      )
      .subscribe({

        error: (error: any) => {
          console.log(error);
        },
        next: (documents: Document[]) => {
          this.documents = documents;
          this.maxDocumentId = this.getMaxId();
          this.documents = this.documents.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
          this.documentListChangedEvent.next(this.documents.slice());
        },
      });
  }

  storeDocuments() {
    const docs = JSON.stringify(this.documents);
    this.http
      .put(
        'https://cmsivettesoto-default-rtdb.firebaseio.com/documents.json',
        docs
      )
      .subscribe((response) => {
        console.log(response);
        this.documentListChangedEvent.next(this.documents.slice());
      });
  }


  addDocument(newDocument: Document) {

    if (newDocument == undefined || newDocument == null) {
      return;
    }

    this.maxDocumentId++;

    newDocument.id = String(this.maxDocumentId);
    this.documents.push(newDocument);
    this.storeDocuments();
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (originalDocument == undefined || originalDocument == null) {
      return;
    }
    if (newDocument == undefined || newDocument == null) {
      return;
    }

    let pos: number = this.documents.indexOf(originalDocument);
    if (pos < 0) {
      return;
    }

    newDocument.id = originalDocument.id;
    this.documents[pos] = newDocument;
    this.storeDocuments();
  }

  deleteDocument(document: Document) {
    if (document == undefined || document == null) {
      return;
    }

    let pos: number = this.documents.indexOf(document);
    if (pos < 0) {
      return;
    }

    this.documents.splice(pos, 1);
    this.storeDocuments();
  }
}
