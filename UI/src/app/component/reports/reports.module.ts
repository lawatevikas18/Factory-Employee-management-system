import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaxInvoiceComponent } from './tax-invice/tax-invice.component';
import { TaxInviceFormComponent } from './tax-invice-form/tax-invice-form.component';


//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [AttendanceReportComponent, TaxInvoiceComponent,TaxInviceFormComponent ,],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
     NgbModule
    
  
  ]
})
export class ReportsModule { }
