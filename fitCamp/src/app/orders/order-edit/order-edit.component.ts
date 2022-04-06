import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'fitCamp-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent implements OnInit {
  originalOrder: Order | null = null;
  order?: Order;
  editMode: boolean = false;
  id?: string;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalOrder = this.orderService.getOrder(this.id);
      if (!this.originalOrder) return;
      this.editMode = true;
      this.order = JSON.parse(JSON.stringify(this.originalOrder));
    });
  }

  onSubmit(f: NgForm) {
    var value = f.value;
    var newOrder = new Order(
      value.id,
      value.name,
      value.description,
      value.url,
      []
    );
    if (this.editMode) {
      this.orderService.updateOrder(this.originalOrder!, newOrder);
    } else {
      this.orderService.addOrder(newOrder);
    }
    this.router.navigate(['orders']);
  }

  onCancel() {
    this.router.navigate(['orders']);
  }

}
