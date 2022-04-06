import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header.component';

import { ClientsComponent } from './clients/client.component';
import { ClientListComponent } from './clients/client-list/client-list.component';
import { ClientDetailComponent } from './clients/client-detail/client-detail.component';
import { ClientItemComponent } from './clients/client-item/client-item.component';
import { ClientEditComponent } from './clients/client-edit/client-edit.component';

import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderEditComponent } from './orders/order-edit/order-edit.component';
import { OrderItemComponent } from './orders/order-item/order-item.component';

import { DropdownDirective } from './shared/dropdown.directive';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { ClientsFilterPipe } from './clients/clients-filter.pipe';
import { ClientService } from './clients/client.service';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ClientsComponent,
    ClientListComponent,
    ClientDetailComponent,
    ClientItemComponent,
    OrdersComponent,
    OrderListComponent,
    OrderItemComponent,
    OrderDetailComponent,
    DropdownDirective,
    OrderEditComponent,
    ClientEditComponent,
    ClientsFilterPipe,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ClientService],
  bootstrap: [AppComponent]
})
export class AppModule { }
