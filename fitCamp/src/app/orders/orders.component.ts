import { Component, OnInit } from '@angular/core';
import { Order } from './order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'fitCamp-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  selectedOrder!: Order

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.orderSelectedEvent.subscribe(
      (order: Order) => {
        this.selectedOrder = order;
      }
      );

   }

  onSelectedOrder(order: Order): void {
    this.selectedOrder = order;
  }
}

