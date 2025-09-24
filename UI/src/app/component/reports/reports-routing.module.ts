import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceReportComponent } from './attendance-report/attendance-report.component';
// import { TaxInviceFormComponent } from './tax-invice-form/tax-invice-form.component';


const routes: Routes = [
  {path:'',
    component:AttendanceReportComponent
  },
  // {path:'invice-form',
  //   component:TaxInviceFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
