import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeForm!: FormGroup;
  employees: any[] = [];
  isEdit = false;
  selectedId: number | null = null;
  selectedEmployee: any = null;
  loading = false;
  isemployeeForm = false;
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  photoUrl = "https://emp360-001-site1.stempurl.com";

  designations: string[] = ['Manager','Supervisor','Worker','Accountant','Security','Driver'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private loader: LoaderService,
    private errormsg: ErrorPopUpService,
    private toastr: ToastrService,
    private router: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile2: [''],
      role: ['', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(1000)]],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      aadhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      panCard: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
      imagePath: ['']
    });

    this.router.queryParams.subscribe(params => {
      if(params['from'] === 'Attendance' || params['from'] === 'Advance') {
        this.addNew();
      }
    });

    this.loadEmployees();
  }

  private getMultipartHeader() {
    const token = sessionStorage.getItem('token') || '';
    return { Authorization: `Bearer ${token}` };
  }

  submit() {
    if (this.employeeForm.invalid) {
      this.toastr.error('Please fix validation errors.', 'Error');
      return;
    }

    const formData = new FormData();
    Object.keys(this.employeeForm.value).forEach(key => {
      formData.append(key, this.employeeForm.value[key]);
    });

    if (this.selectedFile) {
      formData.append("Image", this.selectedFile);
    }

    if (this.isEdit && this.selectedId) {
      formData.append("employeeId", this.selectedId.toString());
      this.http.put(`${environment.apiUrl}/Employee/${this.selectedId}`, formData, { headers: this.getMultipartHeader() })
        .subscribe({
          next: () => {
            this.toastr.success('Employee updated successfully!', 'Success');
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.toastr.error(err?.error?.message || 'Update failed', 'Error')
        });
    } else {
      this.http.post(`${environment.apiUrl}/Employee`, formData, { headers: this.getMultipartHeader() })
        .subscribe({
          next: () => {
            this.toastr.success('Employee added successfully!', 'Success');
            this.resetForm();
            this.loadEmployees();
          },
          error: err => this.toastr.error(err?.error?.message || 'Add failed', 'Error')
        });
    }
  }

  editPhotoEmployee: any = null;
 edit(emp: any) {
  this.isEdit = true;
  this.selectedId = emp.employeeId;
  this.employeeForm.patchValue(emp);

  this.photoPreview = null;
  this.selectedFile = null;
  this.isemployeeForm = true;

  // NEW: keep reference for photo display
  this.editPhotoEmployee = emp;

  this.selectedEmployee = null; // still modal should not open
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


  viewEmployee(emp: any) {
    this.selectedEmployee = emp; // only for modal
  }

  closeModal() {
    this.selectedEmployee = null;
  }

  addNew() {
    this.isemployeeForm = true;
    this.isEdit = false;
    this.selectedEmployee = null;
    this.photoPreview = null;
    this.selectedFile = null;
    this.employeeForm.reset({ monthlySalary: 0 });
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${environment.apiUrl}/Employee/${id}`, { headers: this.getMultipartHeader() })
        .subscribe({
          next: () => this.loadEmployees(),
          error: () => this.toastr.error('Delete failed', 'Error')
        });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    this.isemployeeForm = false;
    this.selectedEmployee = null;
    this.photoPreview = null;
    this.selectedFile = null;
    this.employeeForm.reset({ monthlySalary: 0 });
    this.editPhotoEmployee = null;

  }

  loadEmployees() {
    this.loader.show();
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.loader.hide();
      },
      error: (err) => {
        this.loader.hide();
        this.errormsg.showError(err?.error);
      },
      complete: () => this.loader.hide()
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = e => this.photoPreview = reader.result as string;
      reader.readAsDataURL(this.selectedFile);
    }
  }

  toUpperCase(event: any) {
    const value = event.target.value.toUpperCase();
    this.employeeForm.get('panCard')?.setValue(value, { emitEvent: false });
  }
}
