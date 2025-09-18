import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDetailsRoutingModule } from './employee-details-routing.module';
import { EmployeeDetailsComponent } from './employee-details.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    EmployeeDetailsComponent,
    // EmployeeFormComponent
  ],
  imports: [
    CommonModule,
    EmployeeDetailsRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule   
  ]
})
export class EmployeeDetailsModule { }
