import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AttendanceRoutingModule } from './attendance-routing.module';
import { AttendanceComponent } from './attendance.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared/shared.module';


@NgModule({
  declarations: [
    AttendanceComponent,

  ],
  imports: [
    CommonModule,
    AttendanceRoutingModule,
    TranslateModule,
    FormsModule,
        ReactiveFormsModule,
        SharedModule   
  ]
})
export class AttendanceModule { }

