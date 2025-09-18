import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoryBillRoutingModule } from './factory-bill-routing.module';
import { FactoryBillComponent } from './factory-bill.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FactoryBillComponent
  ],
  imports: [
    CommonModule,
    FactoryBillRoutingModule,
    FormsModule
  ]
})
export class FactoryBillModule { }
