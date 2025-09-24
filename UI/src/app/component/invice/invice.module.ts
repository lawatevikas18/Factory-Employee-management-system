import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InviceRoutingModule } from './invice-routing.module';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TaxInvoiceComponent } from './tax-invoice/tax-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [TaxInvoiceFormComponent,TaxInvoiceComponent],
  imports: [
    CommonModule,
    InviceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class InviceModule { }
