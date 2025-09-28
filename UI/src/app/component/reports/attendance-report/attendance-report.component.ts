import { Component, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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

  @ViewChild('reportContent', { static: false }) reportContent!: ElementRef;

  constructor(private http: HttpClient) {}

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

  fetchReport() {
    const request = {
      fromDate: this.fromDate,
      toDate: this.toDate,
      employeeCode: this.employeeCode || ''
    };

    this.http.post<any>('https://localhost:44392/api/Auth/attendanceReport', request)
      .subscribe(res => {
        if (res.statusCode === 200) {
          this.reportData = res.jsonStr;
        }
      });
  }

   async downloadReportPdf(): Promise<void> {
    if (this.isGeneratingPdf) return;
    this.isGeneratingPdf = true;

    try {
      // Dynamic import
      const [
        { default: jsPDF },
        { default: html2canvas }
      ] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const element = this.reportContent.nativeElement;

      // Clone element for PDF
      const clonedElement = element.cloneNode(true) as HTMLElement;
      this.applyPdfStyles(clonedElement);

      // Temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm';
      tempContainer.style.background = '#ffffff';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      try {
        // High quality canvas
        const canvas = await html2canvas(clonedElement, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: false,
          logging: false,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight
        });

        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Failed to generate canvas');
        }

        // PDF export
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'landscape', // for wide tables
          unit: 'mm',
          format: 'a4'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight <= pageHeight - 20) {
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        } else {
          const scaledHeight = pageHeight - 20;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          pdf.addImage(imgData, 'PNG', 10, 10, scaledWidth, scaledHeight);
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `attendance-report-${currentDate}.pdf`;
        pdf.save(filename);

      } finally {
        document.body.removeChild(tempContainer);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('PDF generation failed. Please try again.');
    } finally {
      this.isGeneratingPdf = false;
    }
  }

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
}
