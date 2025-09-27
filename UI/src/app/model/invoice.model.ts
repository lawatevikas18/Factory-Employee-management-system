export interface InvoiceItem {
  srNo: number;
  description: string;
  serviceCode?: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
}

export interface InvoiceFormData {
  companyName: string;
  address: string;
  description: string;
  gstin: string;
  panNo: string;
  stateCode: string;
  state: string;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
  customerAddress: string;
  customerGstin: string;
  customerState: string;
  customerStateCode: string;
  workOrderNo: string;
  workingPeriodFrom: string;
  workingPeriodTo: string;
  items: InvoiceItem[];
  igstRate: number;
  cgstRate?: number;
  sgstRate?: number;
}

export interface InvoiceTotals {
  subtotal: number;
  igstAmount: number;
  cgstAmount?: number;
  sgstAmount?: number;
  total: number;
}