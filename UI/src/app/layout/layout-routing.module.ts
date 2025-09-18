import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('../component/dashboard/dashboard.module').then(m => m.DashboardModule) },
     { path: 'employee-details', loadChildren: () => import('../component/employee-details/employee-details.module').then(m => m.EmployeeDetailsModule) },
     { path: 'employee-attendance', loadChildren: () => import('../component/attendance/attendance.module').then(m=> m.AttendanceModule)},
     { path: 'employee-salary', loadChildren: () => import('../component/salary/salary.module').then(m=>m.SalaryModule)},
     { path: 'reports', loadChildren: () => import('../component/reports/reports.module').then(m=>m.ReportsModule)},
     { path: 'advance', loadChildren: () => import('../component/advance/advance.module').then(m=>m.AdvanceModule)}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule {}
