import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: any[] = [];
  wallets: any[] = [];
  isEdit = false;
  selectedId: number | null = null;
  loading = false;
  message = '';
  error = '';
  isemployeeForm = false;

  private apiUrl = environment.apiUrl;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private route: Router,
    private loader: LoaderService,
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile2: ['', [Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(1000)]],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      aadhaar: ['', [Validators.pattern('^[0-9]{12}$')]],
      panCard: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]]
    });
//this.loader.show()
    this.loadEmployees();
   // this.loadWallets();
  }

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }) };
  }

  loadWallets() {
    this.http.get<any[]>(`${this.apiUrl}/employee_wallete`, this.getHeaders())
      .subscribe({
        next: res => this.wallets = res,
        error: () => console.warn('Wallet fetch failed (Admin cannot view wallets)')
      });
  }

  submit() {
    if (this.employeeForm.invalid) {
      this.error = 'Please fix validation errors.';
      return;
    }

    this.error = '';
    const body = this.employeeForm.value;

    if (this.isEdit && this.selectedId) {
      this.http.put(`${this.apiUrl}/Employee/${this.selectedId}`, { ...body, employeeId: this.selectedId }, this.getHeaders())
        .subscribe({
          next: () => {
            this.message = 'Employee updated';
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.error = err?.error?.message || 'Update failed'
        });
    } else {
      this.http.post(`${this.apiUrl}/Employee`, body, this.getHeaders())
        .subscribe({
          next: () => {
            this.message = 'Employee added';
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.error = err?.error?.message || 'Add failed'
        });
    }
  }

  edit(emp: any) {
    this.isEdit = true;
    this.selectedId = emp.employeeId;
    this.employeeForm.patchValue(emp);
    this.isemployeeForm = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(empId: number) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.http.delete(`${this.apiUrl}/Employee/${empId}`, this.getHeaders())
      .subscribe({
        next: () => {
          this.message = 'Employee deleted';
          this.loadEmployees();
          this.loadWallets();
        },
        error: err => this.error = err?.error?.message || 'Delete failed'
      });
  }

  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    this.employeeForm.reset({ monthlySalary: 0 });
    this.isemployeeForm = false;
  }

  walletBalance(empId: number) {
    const w = this.wallets.find(x => x.employeeId === empId);
    return w ? w.advanceBalance : 0;
  }

  addNew() {
    this.isemployeeForm = true;
  }

loadEmployees() {
  this.loader.show();   // 🔹 show loader before API call
  this.employeeService.getEmployees().subscribe({
    next: (res) => {
      this.employees = res;
    },
    error: (err) => {
      this.loader.hide()
      console.error('Error loading employees', err);
    },
    complete: () => {
      this.loader.hide();  // 🔹 always hide when API finishes
    }
  });
}

}
