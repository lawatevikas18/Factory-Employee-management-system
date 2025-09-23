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
  employeeId?: number;
  name: string;
  address?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  role?: string;
  aadhaar?: string;
  panCard?: string;
  mobile1?: string;
  mobile2?: string;
  monthlySalary: number;
}


@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent {
    employees: Employee[] = [];
  filteredEmployees: any = [];
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
  errorMessage = '';
  searchText = '';

  constructor(
    private empService: EmployeeService,
    private advancesService: EmployeeAdvancesService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private router: ActivatedRoute,
    private errormsg: ErrorPopUpService,
    private employeeService: EmployeeService,
    private route: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
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
  loadEmployees() {
    this.empService.getAllEmployees().subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load transactions';
        this.loading = false;
        this.errorMessage = 'Failed to load employees';
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
  loadTransactions() {
    this.advancesService.getAll().subscribe({
      next: (data) => (this.transactions = data),
      error: () => (this.errorMessage = 'Failed to load transactions')
    });
  }

  searchEmployee() {
    if (!this.searchTerm.trim()) {
      this.showEmployeePopup = false;
      return;
    }
  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.showEmployeePopup = this.filteredEmployees.length > 0;
  }

  selectEmployee(emp: any) {
    this.selectedEmployee = emp;
  selectEmployee(emp: Employee) {
    this.advanceForm.patchValue({
      employeeId: emp.employeeId
    });
    this.showEmployeePopup = false;
    this.searchTerm = ''; // reset search box
  }


  onSubmit() {
    console.log(this.advanceForm.value);
    if (this.advanceForm.invalid) return;

    const payload = {
      ...this.advanceForm.value,
      createdAT: new Date().toISOString()
    };

    this.advancesService.sendAdvance(payload).subscribe({
    this.advancesService.sendAdvance(this.advanceForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
        this.advanceForm.reset({ paymentMode: 'Cash' });
        this.selectedEmployee = null;
        this.loadTransactions();
        this.advanceForm.reset({ paymentMode: 'Cash' });
        setTimeout(() => (this.successMessage = ''), 3000);
        this.loadEmployees();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to send advance';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }
}

