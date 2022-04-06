import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';
import { Order } from '../order.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'fitCamp-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})

export class OrderDetailComponent implements OnInit {
  order?: Order | null;
  id!: string;
  nativeWindow: any;

  constructor(
    private orderService: OrderService,
    private windowRefService: WindRefService,
    private route: ActivatedRoute,
    private router: Router,
    ){
      this.nativeWindow = windowRefService.getNativeWindow();
  }

  onView() {
    if (this.order?.url) {
      this.nativeWindow.open(this.order.url);
    }
  }

  onDelete() {
    if (this.order) {
      this.orderService.deleteOrder(this.order);
      this.router.navigate(['/orders']);
    }
  }
    ngOnInit(): void {
      this.route.params.subscribe(
        (params: Params) => {
          this.id = params['id'];
          this.order = this.orderService.getOrder(this.id)
        }
      );

    }
  }
