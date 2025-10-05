import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeeDetailsRoutingModule } from './employee-details-routing.module';
import { EmployeeDetailsComponent } from './employee-details.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';


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
    SharedModule   ,
    ImageCropperModule
  ]
})
export class EmployeeDetailsModule { }
