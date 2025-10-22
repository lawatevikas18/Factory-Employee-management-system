import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvanceTransaction, EmployeeAdvancesService } from 'src/app/core/services/employee-advance.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SessionService } from 'src/app/core/services/session.service';

export interface Employee {
  employeeId?: number;
  name: string;
  mobile1?: string;
  monthlySalary?: number;
  advanceBalance?: number;
}

@Component({
  selector: 'app-advance',
  templateUrl: './advance.component.html',
  styleUrls: ['./advance.component.scss']
})
export class AdvanceComponent {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  transactions: AdvanceTransaction[] = [];
  sendAdvanceForm = false;
  showDetails = false;
  advanceHistory: any[] = [];
  userData: any;
  selectedEmployee?: Employee;
  selectedHistoryEmployee?: Employee;

  advanceForm!: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  searchText = '';

  constructor(
    private empService: EmployeeService,
    private advancesService: EmployeeAdvancesService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private router: Router,
    private session: SessionService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.loadTransactions();
    this.userData = this.session.geetUserDetails();

    this.advanceForm = this.fb.group({
      employeeId: ['', Validators.required],
      reason: ['', Validators.required],
      paymentMode: ['Cash', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      date: ['', Validators.required],
      payment_catagaory: ['', Validators.required],
    });
  }

  loadEmployees() {
    this.loader.show();
    this.empService.getAllEmployees().subscribe({
      next: (data) => {
        this.loader.hide();
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: () => {
        this.loader.hide();
        this.errorMessage = 'Failed to load employees';
      }
    });
  }

  loadTransactions() {
    this.advancesService.getAll().subscribe({
      next: (data) => (this.transactions = data),
      error: () => (this.errorMessage = 'Failed to load transactions')
    });
  }

  filterEmployees() {
    this.filteredEmployees = this.employees.filter(emp =>
      emp.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectEmployee(emp: Employee) {
    this.selectedEmployee = emp;
    this.advanceForm.patchValue({ employeeId: emp.employeeId });
    this.sendAdvanceForm = true;
  }

  closeForm() {
    this.sendAdvanceForm = false;
    this.selectedEmployee = undefined;
  }

  onSubmit() {
    if (this.advanceForm.invalid) return;
    this.loader.show();
    this.advancesService.sendAdvance(this.advanceForm.value).subscribe({
      next: (res) => {
        this.loader.hide();
        this.successMessage = res.message;
        this.loadTransactions();
        this.loadEmployees();
        this.advanceForm.reset({ paymentMode: 'Cash' });
        setTimeout(() => (this.successMessage = ''), 3000);
        this.closeForm();
      },
      error: (err) => {
        this.loader.hide();
        this.errorMessage = err.error || 'Failed to send advance';
        setTimeout(() => (this.errorMessage = ''), 3000);
      }
    });
  }

  viewEmployee(emp: Employee) {
    this.loader.show();
    this.selectedHistoryEmployee = emp;
    this.advancesService.getAdvanceDetail(emp.employeeId).subscribe({
      next: (res) => {
        this.showDetails = true;
        this.advanceHistory = res;
        this.loader.hide();
      },
      error: () => this.loader.hide()
    });
  }

  closeAdvanceDetails() {
    this.showDetails = false;
    this.selectedHistoryEmployee = undefined;
  }

  openAddPopup() {
    this.router.navigate(['/employee-details'], { queryParams: { from: 'Advance' } });
  }
}
