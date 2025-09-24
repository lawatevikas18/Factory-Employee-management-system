import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaxInvoiceFormComponent } from './tax-invoice-form/tax-invoice-form.component';
import { TaxInvoiceComponent } from './tax-invoice/tax-invoice.component';

const routes: Routes = [
  {
      path: '',
     component:TaxInvoiceFormComponent
    },
     {
      path: 'Invice-preview',
     component:TaxInvoiceComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InviceRoutingModule { }
