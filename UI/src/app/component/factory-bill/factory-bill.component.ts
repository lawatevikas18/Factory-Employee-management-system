import { Component, OnInit } from '@angular/core';
import { FactoryBill } from 'src/app/model/FactoryBill.model';
import { FactoryBillService } from 'src/app/core/services/FactoryBill.service';
import { SessionService } from 'src/app/core/services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-factory-bill',
  templateUrl: './factory-bill.component.html',
  styleUrls: ['./factory-bill.component.scss']
})
export class FactoryBillComponent implements OnInit {

  bills: FactoryBill[] = [];
  newBill: FactoryBill = this.resetForm();
  isEditing = false;
  username: any;
  factoryname: any;
  role:boolean = true;

  constructor(
    private billService: FactoryBillService,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('userName');
    this.factoryname = localStorage.getItem('factoryName');
    this.role = localStorage.getItem('role') == 'Admin' ? false : true;
    console.log('User Details:', this.username);
    if (!this.username) {
      Swal.fire('Error', 'User session expired. Please log in again.', 'error');
      return;
    }

    this.loadBills();
  }

  loadBills(): void {
    this.billService.getAll().subscribe({
      next: (data) => {
        this.bills = data || [];
      },
      error: (err) => console.error('Error fetching bills', err),
    });
  }

  calculatePending(): void {
    const total = this.newBill.totalBill || 0;
    const paid = this.newBill.paidAmount || 0;
    this.newBill.pendingAmount = total - paid;
  }

  saveBill(): void {
    if (this.newBill.totalBill < this.newBill.paidAmount) {
      Swal.fire('Error', 'Paid amount cannot exceed total bill!', 'error');
      return;
    }

    if (this.isEditing) {
      this.billService.update(this.newBill).subscribe({
        next: () => {
          Swal.fire('Updated', 'Bill updated successfully!', 'success');
          this.loadBills();
          this.cancelEdit();
        },
        error: (err) => console.error('Error updating bill', err)
      });
    } else {
      this.billService.create(this.newBill).subscribe({
        next: (created) => {
          Swal.fire('Added', 'Bill added successfully!', 'success');
          this.bills.unshift(created);
          this.newBill = this.resetForm();
        },
        error: (err) => console.error('Error creating bill', err)
      });
    }
  }

  editBill(bill: FactoryBill): void {
      if (localStorage.getItem('role') == 'Admin') {
      Swal.fire('inform', 'Admin can not Edit', 'error');
      return;
    }
    this.newBill = { ...bill };
    this.isEditing = true;
  }

  deleteBill(id: number): void {
       if (localStorage.getItem('role') == 'Admin') {
      Swal.fire('Error', 'Admin can not Delete', 'error');
      return;
    }
    Swal.fire({
      title: 'Are you sure?',
      text: 'This bill will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#7f8c8d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.billService.delete(id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Bill deleted successfully.', 'success');
            this.bills = this.bills.filter(b => b.billId !== id);
          },
          error: (err) => console.error('Error deleting bill', err)
        });
      }
    });
  }

  cancelEdit(): void {
    const { userId, factoryName } = this.newBill;
    this.isEditing = false;
    this.newBill = {
      ...this.resetForm(),
      userId,
      factoryName
    };
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
