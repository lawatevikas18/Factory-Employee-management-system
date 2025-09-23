import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvanceRoutingModule } from './advance-routing.module';
import { AdvanceComponent } from './advance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AdvanceComponent
  ],
  imports: [
    CommonModule,
    AdvanceRoutingModule,
    FormsModule ,
    ReactiveFormsModule  
  ]
})
export class AdvanceModule { }
