import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

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

    salaryList: any[] = [];
  salaryHistory: any[] = [];
  selectedEmployee: any = null;
  salaryForm!: FormGroup;
  loading = false;

  // private apiUrl = `${(window as any).__env?.apiUrl || ''}/api/Salary`;
private baseUrl=`${environment.apiUrl}/Salary`
  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSalaryPreview();

    this.salaryForm = this.fb.group({
      employeeId: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  // Add this method to close the history modal
closeHistoryModal() {
  const modal = document.getElementById('historyModal') as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
}

closeGenerateModal() {
  const modal = document.getElementById('generateModal') as HTMLDialogElement;
  if (modal) {
    modal.close();
  }
}

  loadSalaryPreview() {
    this.loading = true;
    this.http.get(`${this.baseUrl}/PreviewAllSalary`).subscribe({
      next: (res: any) => {
        this.salaryList = res;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load salary preview.', 'error');
      }
    });
  }

  viewSalaryHistory(emp: any) {
    this.selectedEmployee = emp;
    this.http.get(`${this.baseUrl}/GetAllSalaryTransactions`).subscribe({
      next: (res: any) => {
        this.salaryHistory = res.filter((x: any) => x.employeeId === emp.employeeId);
        (document.getElementById('historyModal') as HTMLDialogElement).showModal();
      },
      error: () => Swal.fire('Error', 'Failed to fetch salary history', 'error')
    });
  }

  openGenerateModal(emp: any) {
    this.selectedEmployee = emp;
    this.salaryForm.patchValue({
      employeeId: emp.employeeId,
      startDate: emp.startDate,
      endDate: emp.endDate
    });
    (document.getElementById('generateModal') as HTMLDialogElement).showModal();
  }

  generateSalary() {
    if (this.salaryForm.invalid) return;

    Swal.fire({
      title: 'Confirm Generate Salary?',
      text: 'Do you want to generate salary for this employee?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, Generate',
    }).then(result => {
      if (result.isConfirmed) {
        this.http.post(`${this.baseUrl}/GenerateSalary`, this.salaryForm.value).subscribe({
          next: (res: any) => {
            Swal.fire('Success', res.message || 'Salary generated successfully!', 'success');
            this.loadSalaryPreview();
            (document.getElementById('generateModal') as HTMLDialogElement).close();
          },
          error: (err) => {
            Swal.fire('Error', err.error || 'Salary generation failed.', 'error');
          }
        });
      }
    });
  }
}


