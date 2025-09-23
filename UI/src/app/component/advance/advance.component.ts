import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { AdvanceTransaction, EmployeeAdvancesService } from 'src/app/core/services/employee-advance.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { LoaderService } from 'src/app/core/services/loader.service';


export interface Employee {
  id: number;        // Sr No
  name: string;      // Full Name
  mobileNo: string;  // Mobile Number
  source: string;    // Source
  reason: string;    // Reason
  credit: number;    // Credit
  debit: number;     // Debit
  total: number;     // Total = credit - debit
}


@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent {
  transactions: AdvanceTransaction[] = [];
  advanceForm!: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';
  employees: any[] = [];
  searchTerm = '';
  filteredEmployees: any[] = [];
  showEmployeePopup = false;
  selectedEmployee: any = null;

  constructor(
    private advancesService: EmployeeAdvancesService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private router: ActivatedRoute,
    private errormsg: ErrorPopUpService,
    private employeeService: EmployeeService,
    private route: Router,
  ) {}

  ngOnInit(): void {
    this.loadTransactions();

    this.advanceForm = this.fb.group({
      employeeId: ['', Validators.required],
      reason: ['', Validators.required],
      paymentMode: ['Cash', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
    });

    this.loadEmployees();
  }

  loadTransactions() {
    this.loading = true;
    this.advancesService.getAll().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  loadEmployees() {
    this.loader.show();
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.loader.hide();
      },
      error: (err) => {
        this.loader.hide();
        this.errormsg.showError(err?.error);
      },
      complete: () => {
        this.loader.hide();
      }
    });
  }

  searchEmployee() {
    if (!this.searchTerm.trim()) {
      this.showEmployeePopup = false;
      return;
    }
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.showEmployeePopup = this.filteredEmployees.length > 0;
  }

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
    this.advanceForm.patchValue({
      employeeId: emp.employeeId
    });
    this.showEmployeePopup = false;
    this.searchTerm = ''; // reset search box
  }

  onSubmit() {
    if (this.advanceForm.invalid) return;

    const payload = {
      ...this.advanceForm.value,
      createdAT: new Date().toISOString()
    };

    this.advancesService.sendAdvance(payload).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.advanceForm.reset({ paymentMode: 'Cash' });
        this.selectedEmployee = null;
        this.loadTransactions();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to send advance';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }
}

