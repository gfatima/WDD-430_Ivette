import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})

export class DocumentListComponent implements OnInit {
  documents: Document[] = [];
  subscription : Subscription;

  constructor(private documentService: DocumentService) {
    this.documents = this.documentService.getDocuments();
  }

  ngOnInit() {
    this.documents = this.documentService.getDocuments();
    this.subscription = this.documentService.documentChangedEvent
      .subscribe(
        (documentsList: Document[]) => {
          this.documents = documentsList;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
