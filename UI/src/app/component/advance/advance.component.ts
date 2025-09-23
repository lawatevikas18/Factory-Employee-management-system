import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvanceTransaction, EmployeeAdvancesService } from 'src/app/core/services/employee-advance.service';
import { EmployeeService } from 'src/app/core/services/employee.service';
 

export interface Employee {
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
  successMessage = '';
  errorMessage = '';
  searchText = '';

  constructor(
    private empService: EmployeeService,
    private advancesService: EmployeeAdvancesService,
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
    });
  }

  loadEmployees() {
    this.empService.getAllEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = data;
      },
      error: () => {
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
    this.advanceForm.patchValue({
      employeeId: emp.employeeId
    });
  }


  
  onSubmit() {
    console.log(this.advanceForm.value);
    if (this.advanceForm.invalid) return;

    this.advancesService.sendAdvance(this.advanceForm.value).subscribe({
      next: (res) => {
        this.successMessage = res.message;
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

