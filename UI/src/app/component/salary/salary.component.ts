import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  salaryList: any[] = [];
  salaryHistory: any[] = [];
  selectedEmployee: any = null;
  salaryForm!: FormGroup;
  loading = false;
  showHistoryModal = false;
  showGenerateModal = false;
  baseUrl = 'https://emp360-001-site1.stempurl.com/api/Salary';

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.loadSalaryPreview();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  private initForm() {
    this.salaryForm = this.fb.group({
      employeeId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      manualAdvanceDeduct: [0, Validators.required]
    });
  }

  loadSalaryPreview() {
    this.loading = true;
    this.http.get(`${this.baseUrl}/PreviewAllSalary`, { headers: this.getHeaders() })
      .subscribe({
        next: (res: any) => {
          this.salaryList = res;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          Swal.fire('Error', 'Failed to load salary preview.', 'error');
        }
      });
  }

  // ✅ Fixed PDF download
  downloadReport(emp: any) {
    if (!emp?.employeeId) return;

    const url = `${this.baseUrl}/DownloadSalaryReport/${emp.employeeId}`;

    this.http.get(url, {
      headers: this.getHeaders(),
      responseType: 'blob'
    }).subscribe({
      next: (res: Blob) => {
        if (res.size === 0) {
          Swal.fire('Error', 'Empty PDF file received.', 'error');
          return;
        }

        const blob = new Blob([res], { type: 'application/pdf' });
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = `${emp.employeeName}_SalaryReport.pdf`;
        a.click();
        window.URL.revokeObjectURL(fileUrl);
        Swal.fire('Success', 'PDF report downloaded successfully', 'success');
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Failed to download PDF report', 'error');
      }
    });
  }

  viewSalaryHistory(emp: any) {
    this.selectedEmployee = emp;
    this.http.get(`${this.baseUrl}/GetAllSalaryTransactions`, { headers: this.getHeaders() })
      .subscribe({
        next: (res: any) => {
          this.salaryHistory = res.filter((x: any) => x.employeeId === emp.employeeId);
          this.showHistoryModal = true;
        },
        error: () => Swal.fire('Error', 'Failed to fetch salary history', 'error')
      });
  }

  openGenerateModal(emp: any) {
    this.selectedEmployee = emp;
    this.salaryForm.reset({
      employeeId: emp.employeeId,
      startDate: '',
      endDate: '',
      manualAdvanceDeduct: emp.advance || 0
    });
    this.showGenerateModal = true;
  }

  closeModals() {
    this.showGenerateModal = false;
    this.showHistoryModal = false;
  }

  generateSalary() {
    if (this.salaryForm.invalid) {
      Swal.fire('Validation Error', 'Please fill all required fields.', 'warning');
      return;
    }

    const manualAdvance = this.salaryForm.value.manualAdvanceDeduct;
    const availableAdvance = this.selectedEmployee.advance || 0;

    if (manualAdvance < 0) {
      Swal.fire('Invalid Input', 'Advance deduction cannot be negative.', 'warning');
      return;
    }

    if (manualAdvance > availableAdvance) {
      Swal.fire('Validation Error', 'Advance deduction exceeds available advance.', 'warning');
      return;
    }

    Swal.fire({
      title: 'Confirm Generate Salary?',
      text: 'Do you want to generate salary for this employee?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Generate'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.post(`${this.baseUrl}/GenerateSalary`, this.salaryForm.value, {
          headers: this.getHeaders()
        }).subscribe({
          next: (res: any) => {
            Swal.fire('Success', res.message || 'Salary generated successfully!', 'success');
            this.loadSalaryPreview();
            this.closeModals();
          },
          error: (err) => Swal.fire('Error', err.error || 'Salary generation failed.', 'error')
        });
      }
    });
  }
}
