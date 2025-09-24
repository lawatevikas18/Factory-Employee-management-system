import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

interface Employee {
  id: number;
  name: string;
  designation: string;
  status: 'Paid' | 'Pending' | null;
  salary: number;
  advance: number;
}

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {

  salaries: any[] = [];
  form!: FormGroup;
  loading = false;
  submitting = false;
  message = '';
  error = '';

  private apiUrl = `${(window as any).__env?.apiUrl || ''}/api/Salary`;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      employeeId: [null, [Validators.required, Validators.min(1)]],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required]
    });

    this.loadSalaries();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      })
    };
  }

  loadSalaries() {
    this.loading = true;
    this.http.get<any[]>(`${this.apiUrl}/GetAllSalaryTransactions`, this.getHeaders())
      .subscribe({
        next: data => { this.salaries = data; this.loading = false; },
        error: err => { this.error = 'Failed to load salary data'; this.loading = false; }
      });
  }

  generateSalary() {
    this.message = '';
    this.error = '';

    if (this.form.invalid) {
      this.error = 'Please fill all fields correctly.';
      return;
    }

    const { employeeId, startDate, endDate } = this.form.value;
    const s = new Date(startDate);
    const e = new Date(endDate);

    if (e < s) {
      this.error = 'End date must be after start date.';
      return;
    }

    this.submitting = true;

    const body = {
      employeeId,
      startDate: s.toISOString(),
      endDate: e.toISOString()
    };

    this.http.post(`${this.apiUrl}/GenerateSalary`, body, this.getHeaders())
      .subscribe({
        next: (res: any) => {
          this.message = res?.message || 'Salary processed successfully';
          this.submitting = false;
          this.form.reset();
          this.loadSalaries();
        },
        error: err => {
          this.error = err?.error?.message || 'Failed to generate salary';
          this.submitting = false;
        }
      });
  }
}


