import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';

const routes: Routes = [
  {path:'',
    component:AttendanceReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
