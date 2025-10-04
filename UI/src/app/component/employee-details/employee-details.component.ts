import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
 
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm: FormGroup;
  employees: any[] = [];
  message = '';
  error = '';
  isEdit = false;
  selectedId: number | null = null;
  selectedFile: File | null = null;
  selectedEmployee: any = null;

  apiUrl = 'https://localhost:7185/api'; // 🔹 तुझ्या backend URL नुसार बदल

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      role: [''],
      aadhaar: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
      panCard: [''],
      mobile1: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      mobile2: [''],
      monthlySalary: ['', Validators.required],
      factoryName: ['']
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // ✅ Load Employees
  loadEmployees() {
    this.http.get<any[]>(`${this.apiUrl}/Employee`, { headers: this.getAuthHeader() })
      .subscribe({
        next: res => this.employees = res,
        error: err => this.error = 'Failed to load employees'
      });
  }

  // ✅ Submit Add / Update
  submit() {
    if (this.employeeForm.invalid) {
      this.error = 'Please fix validation errors.';
      return;
    }

    this.error = '';
    const formData = new FormData();
    Object.keys(this.employeeForm.value).forEach(key => {
      formData.append(key, this.employeeForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append("Image", this.selectedFile);
    }

    if (this.isEdit && this.selectedId) {
      formData.append("employeeId", this.selectedId.toString());
      this.http.put(`${this.apiUrl}/Employee/${this.selectedId}`, formData, {
        headers: this.getMultipartHeader()
      }).subscribe({
        next: () => {
          this.message = 'Employee updated successfully';
          this.resetForm();
          this.loadEmployees();
        },
        error: err => this.error = err?.error?.message || 'Update failed'
      });
    } else {
      this.http.post(`${this.apiUrl}/Employee`, formData, {
        headers: this.getMultipartHeader()
      }).subscribe({
        next: () => {
          this.message = 'Employee added successfully';
          this.resetForm();
          this.loadEmployees();
        },
        error: err => this.error = err?.error?.message || 'Add failed'
      });
    }
  }

  // ✅ Edit Employee
  editEmployee(emp: any) {
    this.isEdit = true;
    this.selectedId = emp.employeeId;
    this.selectedEmployee = emp;
    this.employeeForm.patchValue(emp);
  }

  // ✅ Delete Employee
  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${this.apiUrl}/Employee/${id}`, { headers: this.getAuthHeader() })
        .subscribe({
          next: () => {
            this.message = 'Employee deleted successfully';
            this.loadEmployees();
          },
          error: () => this.error = 'Delete failed'
        });
    }
  }

  // ✅ Image File Select
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ✅ Reset
  resetForm() {
    this.employeeForm.reset();
    this.isEdit = false;
    this.selectedId = null;
    this.selectedFile = null;
    this.selectedEmployee = null;
  }

  // ✅ JWT Auth Header
  private getAuthHeader() {
    const token = sessionStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }

  private getMultipartHeader() {
    const token = sessionStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }
}
