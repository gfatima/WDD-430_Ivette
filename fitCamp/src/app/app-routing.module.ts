import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { ClientEditComponent } from './clients/client-edit/client-edit.component';
import { ClientsComponent } from './clients/client.component';

import { OrderEditComponent } from './orders/order-edit/order-edit.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrdersComponent } from './orders/orders.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/orders', pathMatch: 'full' },
  { path: 'clients', component: ClientsComponent,
    children: [
      { path: 'new', component: ClientEditComponent },
      { path: ':id', component: ClientDetailComponent },
      { path: ':id/edit', component: ClientEditComponent },
    ],
  },
  { path: 'orders', component: OrdersComponent,
    children: [
      { path: 'new', component: OrderEditComponent },
      { path: ':id', component: OrderDetailComponent },
      { path: ':id/edit', component: OrderEditComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})

export class AppRoutingModule {}
