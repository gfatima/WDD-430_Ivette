import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css'],
})
export class DocumentListComponent implements OnInit {

  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document[] = [
    new Document(
      '1',
      'Lorenzo Snow',
      'Lorenzo Snow, fifth president of the Church of Jesus Christ of Latter-day Saints',
      '*http://url.dummy*',
      []
    ),
    new Document(
      '2',
      'Michelle Obama',
      'Michelle Obama is a lawyer, she served as the first lady of the United States from 2009 to 2017.',
      '*http://url.dummy*',
      []
    ),
    new Document(
      '3',
      'Marie Curie',
      'Marie Curie, a pioneer in the field of radioactivity, was the first person to receive two Nobel Prizes',
      '*http://url.dummy*',
      []
    ),
    new Document(
      '4',
      'Malala Yousafzai',
      'Malala Yousafzai is a Pakistani activist. She received the Nobel Peace Prize in 2014 at age 17.',
      '*http://url.dummy*',
      []
    ),
    new Document(
      '5',
      'J. K. Rowling',
      'J. K. Rowling, is an English writer, film producer, and screenwriter, known for being the author of the Harry Potter book series.',
      '*http://url.dummy*',
      []
    ),
  ];

  constructor() {}

  ngOnInit(): void {}

  onSelectedDocument(documents: Document) {
    this.selectedDocumentEvent.emit(documents);
  }
}
