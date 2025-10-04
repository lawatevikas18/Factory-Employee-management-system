import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { Router,ActivatedRoute } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ErrorPopUpService } from 'src/app/core/services/error-pop-up.service';

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
  private apiUrl = environment.apiUrl;
  private modalInstance: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private employeeService: EmployeeService,
    private route: Router,
    private loader: LoaderService,
    private router: ActivatedRoute,
    private errormsg:ErrorPopUpService
  ) {}

  ngOnInit(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      mobile1: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      mobile2: ['', [Validators.pattern('^[0-9]{10}$')]],
      role: ['', Validators.required],
      monthlySalary: [0, [Validators.required, Validators.min(1000)]],
      address: ['',Validators.required],
      village: ['',Validators.required],
      taluka: ['',Validators.required],
      district: ['',Validators.required],
      state: ['',Validators.required],
      aadhaar: ['', [Validators.required,Validators.pattern('^[0-9]{12}$')]],
      panCard: ['', [Validators.pattern('[A-Z]{5}[0-9]{4}[A-Z]{1}')]],
       photo: ['']
    });
   this.router.queryParams.subscribe(params => {
     this.from = params['from']
    if(this.from=='Attendance' ||this.from=='Advance' ){
        this.addNew()
    }
  });
    this.loadEmployees();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('token') || '';
    return { headers: new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }) };
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
    this.uploadedImageUrl = null; // reset preview until upload
  }
   onUpload() {
    if (!this.selectedFile) {
      this.uploadResponse = '❌ Please select a file first.';
      this.uploadSuccess = false;
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile, this.selectedFile.name);

    this.http.post("https://emp360-001-site1.stempurl.com/api/Upload", formData)
      .subscribe({
        next: (res: any) => {
          this.uploadResponse = "✅ Uploaded successfully!";
          this.uploadedImageUrl = "https://emp360-001-site1.stempurl.com" + res.path;
          this.uploadSuccess = true;
        },
        error: (err) => {
          this.uploadResponse = "❌ Upload failed!";
          this.uploadSuccess = false;
        }
      });
  }
}
