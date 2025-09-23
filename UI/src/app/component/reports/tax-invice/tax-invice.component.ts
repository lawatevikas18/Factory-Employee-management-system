import { Component, Input } from '@angular/core';
import { InvoiceFormData, InvoiceTotals } from 'src/app/model/invoice.model';


@Component({
  selector: 'app-tax-invoice',
  templateUrl: './tax-invice.component.html',
  styleUrls: ['./tax-invice.component.css']
})
export class TaxInvoiceComponent {
  @Input() invoiceData: InvoiceFormData | null = null;

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
      workingPeriod: "01/03/03 TO 17/11/2005",
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