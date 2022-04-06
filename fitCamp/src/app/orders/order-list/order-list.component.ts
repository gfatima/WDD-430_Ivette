import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'fitCamp-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private subscription! : Subscription;

  constructor(private orderService: OrderService) {
    this.orders = this.orderService.getOrders();
  }

  ngOnInit() {
    this.orders = this.orderService.getOrders();
    this.subscription = this.orderService.orderListChangedEvent
    .subscribe(
        (ordersList: Order[]) => {
          this.orders = ordersList;
        });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
