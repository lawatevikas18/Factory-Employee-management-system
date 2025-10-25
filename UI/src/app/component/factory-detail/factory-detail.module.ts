import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FactoryDetailRoutingModule } from './factory-detail-routing.module';
import { FactoryDetailComponent } from './factory-detail.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FactoryDetailComponent
  ],
  imports: [
    CommonModule,
      FormsModule,
    FactoryDetailRoutingModule
  ]
})
export class FactoryDetailModule { }
