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
  endDateError: string = '';

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
        next: (res: any) => { this.salaryList = res; this.loading = false; },
        error: () => { this.loading = false; Swal.fire('Error', 'Failed to load salary preview.', 'error'); }
      });
  }

  downloadReport(emp: any) {
    if (!emp?.employeeId) return;
    const url = `${this.baseUrl}/DownloadSalaryReport/${emp.employeeId}`;
    this.http.get(url, { headers: this.getHeaders(), responseType: 'blob' }).subscribe({
      next: (res: Blob) => {
        if (res.size === 0) { Swal.fire('Error', 'Empty PDF file received.', 'error'); return; }
        const blob = new Blob([res], { type: 'application/pdf' });
        const fileUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = fileUrl;
        a.download = `${emp.employeeName}_SalaryReport.pdf`; a.click();
        window.URL.revokeObjectURL(fileUrl);
        Swal.fire('Success', 'PDF report downloaded successfully', 'success');
      },
      error: () => Swal.fire('Error', 'Failed to download PDF report', 'error')
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
    if (sessionStorage.getItem('role') == 'Admin') { Swal.fire('Access Denied', 'Admins are not allowed to generate salary.', 'warning'); return; }
    this.selectedEmployee = emp;

    // Start Date comes from API
    const startDate = emp.startDate ? this.formatDate(new Date(emp.startDate)) : this.formatDate(new Date());

    this.salaryForm.reset({
      employeeId: emp.employeeId,
      startDate: startDate,
      endDate: '',
      manualAdvanceDeduct: emp.advance || 0
    });

    this.endDateError = '';
    this.showGenerateModal = true;
  }

  checkEndDate() {
    const endDateValue = this.salaryForm.value.endDate;
    if (!endDateValue) { this.endDateError = ''; return; }

    const end = new Date(endDateValue);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (end >= today) { this.endDateError = 'Future date not allowed'; }
    else { this.endDateError = ''; }
  }

  generateSalary() {
    if (this.salaryForm.invalid || this.endDateError) {
      Swal.fire('Validation Error', 'Please fix the errors before submitting.', 'warning');
      return;
    }

    const manualAdvance = this.salaryForm.value.manualAdvanceDeduct;
    const availableAdvance = this.selectedEmployee.advance || 0;

    if (manualAdvance < 0 || manualAdvance > availableAdvance) {
      Swal.fire('Validation Error', 'Invalid advance deduction.', 'warning');
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
        this.http.post(`${this.baseUrl}/GenerateSalary`, this.salaryForm.value, { headers: this.getHeaders() })
          .subscribe({
            next: (res: any) => { Swal.fire('Success', res.message || 'Salary generated successfully!', 'success'); this.loadSalaryPreview(); this.closeModals(); },
            error: (err) => Swal.fire('Error', err.error.message || 'Salary generation failed.', 'error')
          });
      }
    });
  }

  closeModals() {
    this.showGenerateModal = false;
    this.showHistoryModal = false;
  }

  formatDate(date: Date): string {
    const d = date; const month = ('0'+(d.getMonth()+1)).slice(-2);
    const day = ('0'+d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }
}
