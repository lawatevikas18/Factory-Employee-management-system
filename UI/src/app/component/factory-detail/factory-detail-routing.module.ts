import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactoryDetailComponent } from './factory-detail.component';

const routes: Routes = [{ path: '', component: FactoryDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoryDetailRoutingModule { }
