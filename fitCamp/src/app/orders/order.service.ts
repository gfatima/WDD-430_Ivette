import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Order } from './order.model';
import { Subscription, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class OrderService {
  @Output() orderSelectedEvent: EventEmitter<Order> = new EventEmitter<Order>();
  orderListChangedEvent = new Subject<Order[]>();

  orders: Order[] = [];
  maxOrderId: number = 0;

  constructor(private http: HttpClient) {
    this.getDatabaseData();
  }

  getOrders() {
    return this.orders.slice();
  }

  getOrder(id: string) {
    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].id === id) {
        return this.orders[i];
      }
    }
    return null;
  }

  getMaxId(): number {
    let maxId: number = 0;

    for (let i: number = 0; i < this.orders.length; i++) {
      let currentId: number = parseInt(this.orders[i].id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  getDatabaseData() {
    this.http
      .get<Order[]>(
        "http://localhost:3000/orders"
      )
      .subscribe({

        error: (error: any) => {
          console.log(error);
        },
        next: (orders: Order[]) => {
          this.orders = orders;
          this.maxOrderId = this.getMaxId();
          this.orders = this.orders.sort((a, b) => (a.name < b.name) ? 1 : (a.name > b.name) ? -1 : 0);
          this.orderListChangedEvent.next(this.orders.slice());
        },
      });
  }

  storeOrders() {
    const docs = JSON.stringify(this.orders);
    this.http
      .put(
        'http://localhost:3000/orders',
        docs
      )
      .subscribe((response) => {
        console.log(response);
        this.orderListChangedEvent.next(this.orders.slice());
      });
  }

  addOrder(order: Order) {
    if (!order) {
      return;
    }

    // make sure id of the new order is empty
    order.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, order: Order }>('http://localhost:3000/orders',
      order,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new order to orders
          this.orders.push(responseData.order);
          this.storeOrders();
        }
      );
  }

  updateOrder(originalOrder: Order, newOrder: Order) {
    if (!originalOrder || !newOrder) {
      return;
    }

    const pos = this.orders.findIndex(d => d.id === originalOrder.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new order to the id of the old order
    newOrder.id = originalOrder.id;
    //neworder._id = originalorder._id;
    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put<any>('http://localhost:3000/orders/' + originalOrder.id,
      newOrder, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.orders[pos] = newOrder;
          //this.storeorders();
          this.orderListChangedEvent.next(this.orders.slice());
        }
      );
  }

  deleteOrder(order: Order) {

    if (!order) {
      return;
    }

    const pos = this.orders.findIndex(d => d.id === order.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete<any>('http://localhost:3000/orders/' + order.id)
      .subscribe(
        (response: Response) => {
          this.orders.splice(pos, 1);
          this.storeOrders();
        }
      );
  }

}
