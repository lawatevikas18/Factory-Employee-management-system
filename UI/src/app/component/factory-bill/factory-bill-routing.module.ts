import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactoryBillComponent } from './factory-bill.component';

const routes: Routes = [{ path: '', component: FactoryBillComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryBillRoutingModule { }
