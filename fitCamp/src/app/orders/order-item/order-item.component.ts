import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Order } from '../order.model';

@Component({
  selector: 'fitCamp-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})

export class OrderItemComponent implements OnInit {

  @Input() order!: Order;
  @Output() selectedContact = new EventEmitter<void>();
  constructor() { }

  ngOnInit(): void {
  }

}
