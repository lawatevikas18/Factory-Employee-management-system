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

 
  filteredTransactions: AdvanceTransaction[] = [];
  

  searchQuery: string = '';
  searchResults: any[] = [];
  showPopup: boolean = false;

  constructor(
    private advancesService: EmployeeAdvancesService,
    private fb: FormBuilder,
    private loader: LoaderService,
        private router: ActivatedRoute,
        private errormsg:ErrorPopUpService,
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
    });
    this.loadEmployees()
  }

  loadTransactions() {
    this.loading = true;
    this.advancesService.getAll().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load transactions';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.advanceForm.invalid) return;

    this.advancesService.sendAdvance(this.advanceForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.advanceForm.reset({ paymentMode: 'Cash' });
        this.loadTransactions();
        setTimeout(() => (this.successMessage = ''), 3000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to send advance';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }
    loadEmployees() {
    this.loader.show();   
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.loader.hide();   // ✅ Hide on success
      },
      error: (err) => {
        this.loader.hide();
        this.errormsg.showError(err?.error)
        console.error('Error loading employees', err);
      },
      complete: () => {
        this.loader.hide(); 
      }
    });
  }

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showPopup = false;
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.searchResults = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(query)
    );

    this.showPopup = this.searchResults.length > 0;
  }

  selectEmployee(emp: any) {
    this.searchQuery = emp.name;  // fill selected name in search box
    this.showPopup = false;

    // Filter transactions for this employee
    this.filteredTransactions = this.transactions.filter(
      t => t.employeeId === emp.id
    );
  }

  resetSearch() {
    this.searchQuery = '';
    this.filteredTransactions = this.transactions;
    this.showPopup = false;
  }

  getEmployeeName(id: number): string {
    const emp = this.employees.find(e => e.id === id);
    return emp ? emp.name : `Emp#${id}`;
  }
}
