import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/model/employee.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
   employees: any[] = [];
  wallets: any[] = [];
  form!: FormGroup;
  isEdit = false;
  selectedId: number | null = null;
  loading = false;
  message = '';
  error = '';

  private apiUrl = environment.apiUrl

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      role: [''],
      aadhaar: ['', Validators.pattern(/^\d{12}$/)],
      panCard: ['', Validators.maxLength(10)],
      mobile1: ['', Validators.required],
      mobile2: [''],
      monthlySalary: [0, [Validators.required, Validators.min(0)]],
      factoryName: ['']
    });

    this.loadEmployees();
    this.loadWallets();
  }

  private getHeaders() {
    const token = localStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }) };
  }

  loadEmployees() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/Employee`, this.getHeaders())
      .subscribe({
        next: res => { this.employees = res; this.loading = false; },
        error: () => { this.error = 'Failed to load employees'; this.loading = false; }
      });
  }

  loadWallets() {
    this.http.get<any[]>(`${this.apiUrl}/employee_wallete`, this.getHeaders())
      .subscribe({
        next: res => this.wallets = res,
        error: () => console.warn('Wallet fetch failed (Admin cannot view wallets)')
      });
  }

  submit() {
    if (this.form.invalid) {
      this.error = 'Please fill required fields correctly.';
      return;
    }

    this.error = '';
    const body = this.form.value;

    if (this.isEdit && this.selectedId) {
      this.http.put(`${this.apiUrl}/${this.selectedId}`, { ...body, employeeId: this.selectedId }, this.getHeaders())
        .subscribe({
          next: (res: any) => {
            this.message = res.message || 'Employee updated';
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.error = err?.error?.message || 'Update failed'
        });
    } else {
      this.http.post( `${this.apiUrl}/Employee`, body, this.getHeaders())
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
    this.form.patchValue(emp);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(empId: number) {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    this.http.delete(`${this.apiUrl}/${empId}`, this.getHeaders())
      .subscribe({
        next: (res: any) => {
          this.message = res.message || 'Employee deleted';
          this.loadEmployees();
          this.loadWallets();
        },
        error: err => this.error = err?.error?.message || 'Delete failed'
      });
  }

  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ monthlySalary: 0 });
  }

  walletBalance(empId: number) {
    const w = this.wallets.find(x => x.employeeId === empId);
    return w ? w.advanceBalance : 0;
  }
}



