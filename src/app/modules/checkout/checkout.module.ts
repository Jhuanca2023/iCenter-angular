import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';


import { CheckoutPageComponent } from './pages/checkout-page/checkout-page.component';
import { CheckoutService } from '@core/services/checkout.service';

const routes: Routes = [
  {
    path: '',
    component: CheckoutPageComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CheckoutPageComponent
  ],
  providers: [
    CheckoutService
  ]
})
export class CheckoutModule { }
