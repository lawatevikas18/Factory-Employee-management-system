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
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  private initForm() {
    this.salaryForm = this.fb.group({
      employeeId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  loadSalaryPreview() {
    this.loading = true;
    this.http.get(`${this.baseUrl}/PreviewAllSalary`, { headers: this.getHeaders() }).subscribe({
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

  // ✅ Open salary history modal
  viewSalaryHistory(emp: any) {
    this.selectedEmployee = emp;
    this.http.get(`${this.baseUrl}/GetAllSalaryTransactions`, { headers: this.getHeaders() }).subscribe({
      next: (res: any) => {
        this.salaryHistory = res.filter((x: any) => x.employeeId === emp.employeeId);
        this.showHistoryModal = true; // ✅ Angular-based modal toggle
      },
      error: () => Swal.fire('Error', 'Failed to fetch salary history', 'error')
    });
  }

  // ✅ Open generate modal
  openGenerateModal(emp: any) {
    this.selectedEmployee = emp;
    this.salaryForm.reset({
      employeeId: emp.employeeId,
      startDate: '',
      endDate: ''
    });
    this.showGenerateModal = true;
  }

  // ✅ Close modals
  closeModals() {
    this.showGenerateModal = false;
    this.showHistoryModal = false;
  }

  // ✅ Generate salary
  generateSalary() {
    if (this.salaryForm.invalid) {
      Swal.fire('Validation Error', 'Please select both start and end dates.', 'warning');
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
        this.http.post(`${this.baseUrl}/GenerateSalary`, this.salaryForm.value, { headers: this.getHeaders() }).subscribe({
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