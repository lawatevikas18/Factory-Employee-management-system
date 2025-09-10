import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [AttendanceReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonModule,
    FormsModule,
     NgbModule
    
  
  ]
})
export class ReportsModule { }
