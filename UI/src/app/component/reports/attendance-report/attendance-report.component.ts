import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AttendanceService } from 'src/app/core/services/Attendance.Service';

@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.scss']
})
export class AttendanceReportComponent {
  fromDate: string = '';
  toDate: string = '';
  employeeCode: string = '';

  daysInMonth = 31;
  reportData: any[] = [];
  
  isGeneratingPdf = false;
   maxDate: string = ''; 

  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;

  constructor(private http: HttpClient,
    private attendenceReport:AttendanceService
  ) {}

  setDateRange(range: string) {
    const today = new Date();
    if (range === 'thisMonth') {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      this.fromDate = first.toISOString().split('T')[0];
      this.toDate = last.toISOString().split('T')[0];
    } else if (range === 'lastMonth') {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth(), 0);
      this.fromDate = first.toISOString().split('T')[0];
      this.toDate = last.toISOString().split('T')[0];
    } else if (range === 'last7') {
      const last = new Date(today);
      const first = new Date(today);
      first.setDate(today.getDate() - 7);
      this.fromDate = first.toISOString().split('T')[0];
      this.toDate = last.toISOString().split('T')[0];
    }
  }
    ngOnInit(): void {
    this.setDefaultLastMonth();
    this.maxDate = new Date().toISOString().split('T')[0]; // today’s date (yyyy-mm-dd)
  }
   private setDefaultLastMonth() {
    const today = new Date();
    const first = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const last = new Date(today.getFullYear(), today.getMonth(), 0);

    this.fromDate = first.toISOString().split('T')[0];
    this.toDate = last.toISOString().split('T')[0];
  }

  // fetchReport() {
  //   this.getAllAttendanceReport()
  //   const request = {
  //     fromDate: this.fromDate,
  //     toDate: this.toDate,
  //     employeeCode: this.employeeCode || ''
  //   };

  //   this.http.post<any>('https://localhost:44392/api/Auth/attendanceReport', request)
  //     .subscribe(res => {
  //       if (res.statusCode === 200) {
  //         // this.reportData = res.jsonStr;
  //       }
  //     });
  // }

    downloadReportPdf() {
   const request = {
    fromDate: this.fromDate,
    toDate: this.toDate,
    employeeCode: this.employeeCode || ''
  };

  this.attendenceReport.getAllAttendencePDF(
    request.employeeCode,
    request.fromDate,
    request.toDate
  ).subscribe({
    next: (res) => {
      console.log(res)
    }
  }
)}

  private applyPdfStyles(element: HTMLElement): void {
    // Normalize colors/borders
    const applyStyles = (el: HTMLElement) => {
      el.style.backgroundColor = '#ffffff';
      el.style.color = '#000000';
      el.style.borderColor = '#000000';
      el.style.backgroundImage = 'none';
      el.style.boxShadow = 'none';
      el.style.fontFamily = 'Arial, sans-serif';

      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) applyStyles(child);
      });
    };

    applyStyles(element);

    element.style.maxWidth = '297mm'; // landscape A4 width
    element.style.margin = '0';
    element.style.padding = '20px';
    element.style.fontSize = '11px';
    element.style.lineHeight = '1.3';

    // Fix table borders
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      (table as HTMLElement).style.borderCollapse = 'collapse';
      (table as HTMLElement).style.border = '1px solid #000000';
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        (cell as HTMLElement).style.border = '1px solid #000000';
        (cell as HTMLElement).style.padding = '6px';
        (cell as HTMLElement).style.backgroundColor = '#ffffff';
        (cell as HTMLElement).style.color = '#000000';
      });
    });
  }

  fetchReport() {
  const request = {
    fromDate: this.fromDate,
    toDate: this.toDate,
    employeeCode: this.employeeCode || ''
  };

  this.attendenceReport.getAllAttendence(
    request.employeeCode,
    request.fromDate,
    request.toDate
  ).subscribe({
    next: (res: any[]) => {
      if (!res || res.length === 0) {
        this.reportData = [];
        return;
      }

      // ✅ Take month from request.fromDate
      const startDate = new Date(this.fromDate);
      const year = startDate.getFullYear();
      const month = startDate.getMonth();
      this.daysInMonth = new Date(year, month + 1, 0).getDate();

      // ✅ Group by employee
      const grouped: { [empId: number]: any } = {};
      res.forEach(item => {
        const day = new Date(item.date).getDate();

        if (!grouped[item.employeeId]) {
          grouped[item.employeeId] = {
            employeeId: item.employeeId,
            employeeName: `Employee ${item.employeeId}`, // 👈 replace if API gives name
            employeeCode: `E${item.employeeId}`,         // 👈 replace if API gives code
            days: Array(this.daysInMonth).fill('NA'),
            presentCount: 0,
            absentCount: 0
          };
        }

        let statusChar = 'NA';
        if (item.status === 'Present') statusChar = 'P';
        else if (item.status === 'Absent') statusChar = 'A';
        else if (item.status === 'HalfDay') statusChar = 'H';

        grouped[item.employeeId].days[day - 1] = statusChar;
      });

      // ✅ Calculate totals
      Object.values(grouped).forEach((emp: any) => {
        emp.presentCount = emp.days.filter((d: string) => d === 'P').length;
        emp.absentCount = emp.days.filter((d: string) => d === 'A').length;
      });

      this.reportData = Object.values(grouped);

      console.log("Processed Data for Table:", this.reportData);
    },
    error: (err) => {
      console.error('Error fetching report', err);
    }
  });
}


}
