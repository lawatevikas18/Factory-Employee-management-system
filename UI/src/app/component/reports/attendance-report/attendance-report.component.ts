import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
})
export class AttendanceReportComponent implements OnInit {
   fromDate: NgbDateStruct | null = null;
  toDate: NgbDateStruct | null = null;
  employeeCode: string = '';

  reportData: any[] = [];
  groupedData: { [key: string]: any[] } = {};

daysInMonth: number = 31;
  loading = false;
  error = '';

  constructor(private authService: AuthService,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    // Default: current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.fromDate = {
      year: firstDay.getFullYear(),
      month: firstDay.getMonth() + 1,
      day: firstDay.getDate(),
    };
    this.toDate = {
      year: lastDay.getFullYear(),
      month: lastDay.getMonth() + 1,
      day: lastDay.getDate(),
    };

   // this.loadReport();
  }

  fetchReport() {
    if (!this.fromDate || !this.toDate) {
      this.error = 'Please select both From and To dates';
      return;
    }

    this.error = '';
    this.loading = true;

    // const from = this.formatDate(this.fromDate);
    // const to = this.formatDate(this.toDate);
    // const day=''
 let requestdata={
 fromDate:this.formatDate(this.fromDate),
 toDate:this.formatDate(this.toDate),
 employeeCode:this.employeeCode || '',
 day:''
  }
    this.authService.getReport(requestdata)
  .subscribe({
    next: (res) => {
      if (res.statusCode === 200) {
        this.reportData = res.jsonStr;
        // calculate number of days in selected month
        const startDate = new Date(requestdata.fromDate);
        this.daysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();

        this.groupByEmployee();
      } else {
        this.error = res.msg;
      }
      this.loading = false;
    },
    error: () => {
      this.error = 'Error fetching report';
      this.loading = false;
    }
  });
  }

  private formatDate(date: NgbDateStruct): string {
    return `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
  }

  private groupByEmployee() {
    const grouped: any = {};
        this.reportData .forEach((row: any) => {
          if (!grouped[row.employeeCode]) {
            grouped[row.employeeCode] = {
              employeeCode: row.employeeCode,
              employeeName: row.employeeName,
              designation: row.designation,
              days: Array(this.daysInMonth).fill(''),
              presentCount: 0,
              absentCount: 0
            };
          }

          const day = new Date(row.reportDate).getDate();
          grouped[row.employeeCode].days[day - 1] = row.status;

          if (row.status === 'Full Day') grouped[row.employeeCode].presentCount++;
          else if (row.status === 'Absent') grouped[row.employeeCode].absentCount++;
        });

        this.reportData = Object.values(grouped);
  }

  downloadReportPdf() {
  const request = {
    fromDate:"2025-09-01",
    toDate:"2025-09-30",
     employeeCode:this.employeeCode || '',
 day:''
  };

  // this.http.post('https://localhost:5001/api/reports/attendanceReport/pdf', request, {
  //   responseType: 'blob'
  // }).subscribe((blob: Blob) => {
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = 'AttendanceReport.pdf';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  // });
  this.http.post('https://localhost:44392/api/Auth/attendanceReport/pdf', request, {
    responseType: 'blob'  // 👈 Important
  }).subscribe((res: Blob) => {
    const blob = new Blob([res], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AttendanceReport.pdf';
    a.click();
    window.URL.revokeObjectURL(url);
  });

}


}
