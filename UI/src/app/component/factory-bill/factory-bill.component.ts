import { Component } from '@angular/core';
import { FactoryBill } from 'src/app/model/FactoryBill.model';
import { FactoryBillService } from 'src/app/core/services/FactoryBill.service';

@Component({
  selector: 'app-factory-bill',
  templateUrl: './factory-bill.component.html',
  styleUrls: ['./factory-bill.component.scss']
})
export class FactoryBillComponent {

  bills: FactoryBill[] = [];
  newBill: FactoryBill = this.resetForm();
  isEditing = false;

  constructor(private billService: FactoryBillService) {}

  ngOnInit(): void {
    this.loadBills();
  }

  loadBills(): void {
    this.billService.getAll().subscribe({
      next: (data) => {(this.bills = data) ,console.log("ddd")},
      error: (err) => console.error('Error fetching bills', err),
    });
  }

  saveBill(): void {
    if (this.isEditing) {
      this.billService.update(this.newBill).subscribe(() => {
        this.loadBills();
        this.cancelEdit();
      });
    } else {
      this.billService.create(this.newBill).subscribe(() => {
        this.loadBills();
        this.newBill = this.resetForm();
      });
    }
  }

  editBill(bill: FactoryBill): void {
    this.newBill = { ...bill };
    this.isEditing = true;
  }

  deleteBill(id: number): void {
    if (confirm('Are you sure you want to delete this bill?')) {
      this.billService.delete(id).subscribe(() => this.loadBills());
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.newBill = this.resetForm();
  }

  resetForm(): FactoryBill {
    return {
      userId: 0,
      factoryName: '',
      fromDate: '',
      toDate: '',
      workDescription: '',
      totalBill: 0,
      paidAmount: 0,
      pendingAmount: 0,
    };
  }

}
