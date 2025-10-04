import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AttendanceService } from 'src/app/core/services/Attendance.Service';

interface AttendanceApiData {
  employeeId: number;
  date: string;
  status: string;
}

interface ProcessedEmployee {
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  days: string[];
  presentCount: number;
  absentCount: number;
}
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
  reportData: ProcessedEmployee[] = [];
  loading = false;
  isGeneratingPdf = false;
  maxDate: string = '';

  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;

  // Generate dynamic mock data for current month
  private generateMockData(): AttendanceApiData[] {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth(); // This will be the month we're showing
    const data: AttendanceApiData[] = [];
    
    // Generate data for 3 employees for the current month
    for (let empId = 101; empId <= 103; empId++) {
      // Generate attendance for first 20 days of month
      for (let day = 1; day <= 20; day++) {
        const date = new Date(currentYear, currentMonth, day);
        let status = 'Present';
        
        // Add some variety to the data
        if (empId === 101) {
          if ([3, 7, 15].includes(day)) status = 'Absent';
          if ([4, 12].includes(day)) status = 'HalfDay';
        } else if (empId === 102) {
          if ([2, 8, 18].includes(day)) status = 'Absent';
          if ([6, 14].includes(day)) status = 'HalfDay';
        } else if (empId === 103) {
          if ([1, 9, 16].includes(day)) status = 'Absent';
          if ([5, 11, 19].includes(day)) status = 'HalfDay';
        }
        
        data.push({
          employeeId: empId,
          date: date.toISOString().split('T')[0],
          status: status
        });
      }
    }
    
    return data;
  }

  private mockAttendanceData = this.generateMockData();

  constructor() {}

  ngOnInit(): void {
    this.setDefaultLastMonth();
    this.maxDate = new Date().toISOString().split('T')[0];
    // Auto-fetch data when component loads
    setTimeout(() => this.fetchReport(), 100);
  }

  private setDefaultLastMonth(): void {
    const today = new Date();
    // Use current month to match our mock data
    const first = new Date(today.getFullYear(), today.getMonth(), 1);
    const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    this.fromDate = first.toISOString().split('T')[0];
    this.toDate = last.toISOString().split('T')[0];
  }

  setDateRange(range: string): void {
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

  fetchReport(): void {
    if (!this.fromDate || !this.toDate) {
      console.error('Please select both From and To dates');
      return;
    }

    this.loading = true;

    try {
      const startDate = new Date(this.fromDate);
      const endDate = new Date(this.toDate);
      
      // Filter data by date range first
      let filteredData = this.mockAttendanceData.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });

      // Filter by employee code if provided
      if (this.employeeCode) {
        filteredData = filteredData.filter(item => 
          item.employeeId.toString().includes(this.employeeCode) || 
          `E${item.employeeId}`.toLowerCase().includes(this.employeeCode.toLowerCase())
        );
      }

      // Calculate days in selected period
      const timeDiff = endDate.getTime() - startDate.getTime();
      const daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      this.daysInMonth = daysCount;

      // Group by employee
      const grouped: { [empId: number]: ProcessedEmployee } = {};
      
      filteredData.forEach(item => {
        const itemDate = new Date(item.date);
        const dayIndex = Math.floor((itemDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));

        if (!grouped[item.employeeId]) {
          grouped[item.employeeId] = {
            employeeId: item.employeeId,
            employeeName: `Employee ${item.employeeId}`,
            employeeCode: `E${item.employeeId}`,
            days: Array(daysCount).fill('NA'),
            presentCount: 0,
            absentCount: 0
          };
        }

        if (dayIndex >= 0 && dayIndex < daysCount) {
          let statusChar = 'NA';
          if (item.status === 'Present') statusChar = 'P';
          else if (item.status === 'Absent') statusChar = 'A';
          else if (item.status === 'HalfDay') statusChar = 'H';

          grouped[item.employeeId].days[dayIndex] = statusChar;
        }
      });

      // Calculate totals
      Object.values(grouped).forEach((emp: ProcessedEmployee) => {
        emp.presentCount = emp.days.filter((d: string) => d === 'P').length;
        emp.absentCount = emp.days.filter((d: string) => d === 'A').length;
      });

      this.reportData = Object.values(grouped);
    } catch (err) {
      console.error('Error fetching report', err);
    } finally {
      this.loading = false;
    }
  }

  private applyPdfStyles(element: HTMLElement): void {
    // Normalize colors/borders for PDF
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

  async downloadReportPdf(): Promise<void> {
    if (!this.reportContent) return;

    this.isGeneratingPdf = true;
    
    try {
      // Clone the element to avoid affecting the original
      const element = this.reportContent.nativeElement.cloneNode(true) as HTMLElement;
      document.body.appendChild(element);
      
      // Apply PDF-friendly styles
      this.applyPdfStyles(element);
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('l', 'mm', 'a4'); // Landscape orientation
      
      const imgWidth = 297; // A4 width in mm (landscape)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Attendance_Report_${this.fromDate}_to_${this.toDate}.pdf`);
      
      // Clean up
      document.body.removeChild(element);
    } catch (error) {
      console.error('PDF generation failed:', error);
      // Fallback to print dialog
      window.print();
    } finally {
      this.isGeneratingPdf = false;
    }
  }

}
