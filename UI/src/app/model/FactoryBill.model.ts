export interface FactoryBill {
  billId?: number;
  userId: number;
  factoryName: string;
  fromDate: string;
  toDate: string;
  workDescription?: string;
  totalBill: number;
  paidAmount: number;
  pendingAmount: number;
  createdDate?: string;
}
