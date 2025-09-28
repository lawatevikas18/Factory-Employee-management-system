export interface InvoiceItemDTO {
  srNo: number;
  description: string;
  serviceCode?: string;
  quantity: number;
  unit?: string;
  rate: number;
  amount: number;
}

export interface InvoiceDTO {
  address?: string;
  description?: string;
  gstin?: string;
  panNo?: string;
  stateCode?: string;
  state?: string;
  invoiceNo?: string;
  invoiceDate: any; // ISO date
  workOrderNo?: string;
  workingPeriodFrom?: string;
  workingPeriodTo?: string;
  customerName?: string;
  customerAddress?: string;
  customerGSTIN?: string;
  customerState?: string;
  customerStateCode?: string;
  igstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  items?: InvoiceItemDTO[];
}

export interface InvoiceItem {
  invoiceItemId?: number;
  invoiceId?: number;
  srNo: number;
  description: string;
  serviceCode?: string;
  quantity: number;
  unit?: string;
  rate: number;
  amount: number;
}

export interface Invoice {
  invoiceId: number;
  userid?: number;
  factoryName?: string;
  address?: string;
  description?: string;
  gstin?: string;
  panNo?: string;
  stateCode?: string;
  state?: string;
  invoiceNo?: string;
  invoiceDate?: string;
  workOrderNo?: string;
  workingPeriodFrom?: string;
  workingPeriodTo?: string;
  customerName?: string;
  customerAddress?: string;
  customerGSTIN?: string;
  customerState?: string;
  customerStateCode?: string;
  createdAt?: string;
  igstRate?: number;
  cgstRate?: number;
  sgstRate?: number;
  itemdatas?: InvoiceItem[];
}