import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { InvoiceFormData, InvoiceTotals } from 'src/app/model/invoice.model';


@Component({
  selector: 'app-tax-invoice',
  templateUrl: './tax-invoice.component.html',
  styleUrls: ['./tax-invoice.component.css']
})
export class TaxInvoiceComponent {
  @Input() invoiceData: InvoiceFormData | null = null;
  @ViewChild('invoiceContent', { static: false }) invoiceContent!: ElementRef;
  
  isGeneratingPdf = false;

  get data(): InvoiceFormData {
    return this.invoiceData || this.getDefaultData();
  }

  get totals(): InvoiceTotals {
    const subtotal = this.data.items.reduce((sum, item) => sum + item.amount, 0);
    const igstAmount = (subtotal * this.data.igstRate) / 100;
    const cgstAmount = this.data.cgstRate ? (subtotal * this.data.cgstRate) / 100 : 0;
    const sgstAmount = this.data.sgstRate ? (subtotal * this.data.sgstRate) / 100 : 0;
    const total = subtotal + igstAmount + cgstAmount + sgstAmount;

    return {
      subtotal,
      igstAmount,
      cgstAmount: this.data.cgstRate ? cgstAmount : undefined,
      sgstAmount: this.data.sgstRate ? sgstAmount : undefined,
      total
    };
  }

  // Create empty rows for table formatting
  get emptyRows(): number[] {
    const filledRows = this.data.items.length;
    const totalRows = 11; // Total rows to display
    const emptyRowsCount = Math.max(0, totalRows - filledRows);
    return Array(emptyRowsCount).fill(0).map((_, i) => i);
  }

  onPrint(): void {
    window.print();
  }

  async onDownloadPdf(): Promise<void> {
    if (this.isGeneratingPdf) {
      return;
    }

    this.isGeneratingPdf = true;

    try {
      // Dynamic import to reduce bundle size
      const [
        { default: jsPDF },
        { default: html2canvas }
      ] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const element = this.invoiceContent.nativeElement;
      
      // Create a clone of the element to apply PDF-specific styles
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // Apply PDF-specific styles to handle OKLCH colors
      this.applyPdfStyles(clonedElement);
      
      // Create a temporary container
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.top = '-9999px';
      tempContainer.style.left = '-9999px';
      tempContainer.style.width = '210mm'; // A4 width
      tempContainer.style.background = '#ffffff';
      tempContainer.appendChild(clonedElement);
      document.body.appendChild(tempContainer);

      try {
        // Generate canvas with high quality settings
        const canvas = await html2canvas(clonedElement, {
          scale: 2, // Higher resolution
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          removeContainer: false,
          logging: false,
          width: clonedElement.scrollWidth,
          height: clonedElement.scrollHeight,
          onclone: (clonedDoc) => {
            // Additional style fixes for the cloned document
            const clonedBody = clonedDoc.body;
            clonedBody.style.fontFamily = 'Arial, sans-serif';
          }
        });

        // Validate canvas
        if (!canvas || canvas.width === 0 || canvas.height === 0) {
          throw new Error('Failed to generate canvas from HTML content');
        }

        // Create PDF with simplified single-page approach
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        // Calculate dimensions to fit A4
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Add image to PDF - simplified approach
        if (imgHeight <= pageHeight - 20) {
          // Single page - fits perfectly
          pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        } else {
          // Scale to fit on single page
          const scaledHeight = pageHeight - 20;
          const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
          pdf.addImage(imgData, 'PNG', 10, 10, scaledWidth, scaledHeight);
        }

        // Generate filename with current date
        const currentDate = new Date().toISOString().split('T')[0];
        const filename = `tax-invoice-${this.data.invoiceNo}-${currentDate}.pdf`;

        // Save PDF
        pdf.save(filename);

      } finally {
        // Cleanup
        document.body.removeChild(tempContainer);
      }

    } catch (error) {
      console.error('Error generating PDF:', error);
      
      // Fallback to print dialog
      alert('PDF generation failed. Please use the print option instead.');
      this.onPrint();
      
    } finally {
      this.isGeneratingPdf = false;
    }
  }

  private applyPdfStyles(element: HTMLElement): void {
    // Convert OKLCH and other modern CSS colors to standard colors for PDF
    const styleMap: { [key: string]: string } = {
      'oklch(0.145 0 0)': '#000000',
      'oklch(1 0 0)': '#ffffff', 
      'oklch(0.985 0 0)': '#ffffff',
      'oklch(0.95 0.0058 264.53)': '#f5f5f5',
      'oklch(0.269 0 0)': '#404040',
      'oklch(0.708 0 0)': '#808080',
      'rgba(0, 0, 0, 0.1)': '#e6e6e6',
      'var(--foreground)': '#000000',
      'var(--background)': '#ffffff',
      'var(--border)': '#e6e6e6',
      'var(--muted)': '#f5f5f5',
      'var(--muted-foreground)': '#808080'
    };

    // Apply styles recursively
    const applyStylesToElement = (el: HTMLElement) => {
      // Apply black and white styles for PDF
      el.style.backgroundColor = '#ffffff';
      el.style.color = '#000000';
      el.style.borderColor = '#000000';
      
      // Remove any gradients or complex backgrounds
      el.style.backgroundImage = 'none';
      el.style.boxShadow = 'none';
      
      // Ensure good contrast for borders
      if (el.style.border || window.getComputedStyle(el).border !== 'none') {
        el.style.borderColor = '#000000';
      }

      // Process child elements
      Array.from(el.children).forEach(child => {
        if (child instanceof HTMLElement) {
          applyStylesToElement(child);
        }
      });
    };

    applyStylesToElement(element);

    // Add PDF-specific styles
    element.style.maxWidth = '210mm';
    element.style.margin = '0';
    element.style.padding = '20px';
    element.style.fontFamily = 'Arial, sans-serif';
    element.style.fontSize = '12px';
    element.style.lineHeight = '1.4';
    element.style.backgroundColor = '#ffffff';
    element.style.color = '#000000';

    // Apply page border
    const pageBorder = element.querySelector('.page-border');
    if (pageBorder) {
      (pageBorder as HTMLElement).style.border = '4px solid #000000';
      (pageBorder as HTMLElement).style.backgroundColor = '#ffffff';
    }

    // Apply section header styles
    const sectionHeaders = element.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
      (header as HTMLElement).style.backgroundColor = '#f8f9fa';
      (header as HTMLElement).style.color = '#000000';
      (header as HTMLElement).style.border = '1px solid #000000';
    });

    // Apply total row styles
    const totalRows = element.querySelectorAll('.total-row');
    totalRows.forEach(row => {
      (row as HTMLElement).style.backgroundColor = '#f8f9fa';
      (row as HTMLElement).style.color = '#000000';
    });

    // Ensure table borders are visible
    const tables = element.querySelectorAll('table');
    tables.forEach(table => {
      (table as HTMLElement).style.borderCollapse = 'collapse';
      (table as HTMLElement).style.border = '1px solid #000000';
      
      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        (cell as HTMLElement).style.border = '1px solid #000000';
        (cell as HTMLElement).style.padding = '8px';
        (cell as HTMLElement).style.backgroundColor = '#ffffff';
        (cell as HTMLElement).style.color = '#000000';
      });
    });
  }

  private getDefaultData(): InvoiceFormData {
    return {
      companyName: "NAGAPPA KANTEPPA SHIVUR",
      address: "At. Post. Chandkavathe, Tal. Sindagi, Dist. Vijayapur - 586128",
      description: "Sugar House & Sugar Godwn Work Bill",
      gstin: "29ANAPS7778BZZR",
      panNo: "ANAPS7771B",
      stateCode: "29",
      state: "KARNATAKA",
      invoiceNo: "25",
      invoiceDate: "2025-11-25",
      customerName: "Directeur Sukhoi Kausthanu Uri",
      customerAddress: "Gokikarirama - Tal Sindagi",
      customerGstin: "27AAOCP5704 DXZ1",
      customerState: "Maharashtra",
      customerStateCode: "27",
      workOrderNo: "100/F",
      workingPeriodFrom: "",
       workingPeriodTo: "",
      items: [
        {
          srNo: 1,
          description: "Sugar cane crushing and juice extraction services",
          serviceCode: "14576",
          quantity: 3.70,
          unit: "MT",
          rate: 53.93,
          amount: 199.54
        },
        {
          srNo: 2,
          description: "Sugar processing and refining services",
          serviceCode: "10936",
          quantity: 1.60,
          unit: "MT",
          rate: 17.49,
          amount: 27.98
        },
        {
          srNo: 3,
          description: "Storage and handling services",
          serviceCode: "5640",
          quantity: 1.60,
          unit: "MT",
          rate: 5.80,
          amount: 9.28
        }
      ],
      igstRate: 18
    };
  }
}