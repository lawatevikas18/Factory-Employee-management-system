import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';
import { ToastrService } from 'ngx-toastr';

declare var bootstrap: any; 

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
  selectedEmployee: any = null;  // ✅ For modal
  loading = false;
  message = '';
  error = '';
  isemployeeForm = false;
  from:any
  photoBase64: string | null = null;  
  photoPreview: string | null = null;
  selectedFile: File | null = null;
  uploadResponse: string = '';
  uploadedImageUrl: string | null = null;
  uploadSuccess: boolean = false;
   apiUrl = environment.apiUrl;
  private modalInstance: any;
  photoUrl="https://emp360-001-site1.stempurl.com"
  designations: string[] = [
    'Manager',
    'Supervisor',
    'Worker',
    'Accountant',
    'Security',
    'Driver'
  ];
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private route: Router,
    private loader: LoaderService,
    private router: ActivatedRoute,
    private errormsg:ErrorPopUpService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile2: ['',],
      role: ['', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(1000)]],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      aadhaar: ['', [Validators.required,Validators.pattern('^[0-9]{12}$')]],
      panCard: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
       imagePath: ['']
    });
   this.router.queryParams.subscribe(params => {
     this.from = params['from']
    if(this.from=='Attendance' ||this.from=='Advance' ){
        this.addNew()
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
      // this.error = 'Please fix validation errors.';
       this.toastr.error('Please fix validation errors.', 'Error');
    return;
    }

    // this.error = '';
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
           this.toastr.success('Employee updated successfully!', 'Success');
          this.resetForm();
          this.loadEmployees();
        },
        error: err =>
          this.toastr.error(err?.error?.message || 'Update failed', 'Error')
          //  this.error = err?.error?.message || 'Update failed'
      });
    } else {
      this.http.post(`${this.apiUrl}/Employee`, formData, {
        headers: this.getMultipartHeader()
      }).subscribe({
        next: () => {
          // this.message = 'Employee added successfully';
          this.toastr.success('Employee added successfully!', 'Success');
          this.resetForm();
          this.loadEmployees();
        },
        error: (err) => {
          console.log(err);
          // this.error = err?.error?.message || 'Add failed'
          this.toastr.error(err?.error?.message || 'Update failed', 'Error');
        }
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

    delete(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.http.delete(`${this.apiUrl}/Employee/${id}`, { headers: this.getMultipartHeader() })
        .subscribe({
          next: () => {
            this.message = 'Employee deleted successfully';
            this.loadEmployees();
          },
          error: () => this.error = 'Delete failed'
        });
    }
  }

  resetForm() {
    this.isEdit = false;
    this.selectedId = null;
    // this.employeeForm.reset({ monthlySalary: 0 });
    this.isemployeeForm = false;
  }

  addNew() {
    this.isemployeeForm = true;
  }

  loadEmployees() {
    this.loader.show();   
    this.employeeService.getEmployees().subscribe({
      next: (res) => {
        this.employees = res;
        this.loader.hide();   // ✅ Hide on success
      },
      error: (err) => {
        this.loader.hide();
        this.errormsg.showError(err?.error)
        console.error('Error loading employees', err);
      },
      complete: () => {
        this.loader.hide(); 
      }
    });
  }

  // ✅ Show modal with employee details
viewEmployee(emp: any) {
  this.selectedEmployee = emp;
}
closeModal() {
  this.selectedEmployee = null;
}
onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  toUpperCase(event: any) {
  const value = event.target.value.toUpperCase();
  this.employeeForm.get('panCard')?.setValue(value, { emitEvent: false });
}
}
