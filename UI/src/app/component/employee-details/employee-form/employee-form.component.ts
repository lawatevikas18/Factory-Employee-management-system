import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/services/auth.service';
import { Employee } from 'src/app/model/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit, OnChanges {
  @Input() employee: Employee | null = null;   // input for edit mode
  @Output() saveEmployee = new EventEmitter<Employee>();
  @Output() closeForm = new EventEmitter<void>();

  empForm!: FormGroup;
  adminData:any

 constructor(private  apiService: AuthService, private router: Router,private toastr: ToastrService ,private fb: FormBuilder) {}
  ngOnInit(): void {
    this.buildForm();
    const storedData = localStorage.getItem('adminData');
    if (storedData) {
      this.adminData = JSON.parse(storedData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.empForm.patchValue(this.employee); // load employee data for edit
    }
  }

  buildForm() {
    this.empForm = this.fb.group({
      factoryName: ['', Validators.required],
      workerName: ['', Validators.required],
      workerCode: ['', Validators.required],
      address: [''],
      village: [''],
      taluka: [''],
      district: [''],
      state: [''],
      designation: [''],
      aadhaar: [''],
      pan: [''],
      mobile1: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      mobile2: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      salary: ['', Validators.pattern(/^[0-9]+$/)]
    });
  }

  onSubmit() {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      this.toastr.error('Please fill all required fields correctly.', 'Error');
      return;
    }
   let request={
      "adminName": this.adminData.adminName,
      "role": this.adminData.role,
      "adminId": this.adminData.adminId,
      "action": "Register",
      "empLoyeeDetails": [
        {
          factoryName: this.empForm.get('factoryName')?.value,
      employeeName: this.empForm.get('workerName')?.value,
      employeeCode: this.empForm.get('workerCode')?.value,
      address: this.empForm.get('address')?.value,
      village: this.empForm.get('village')?.value,
      taluka: this.empForm.get('taluka')?.value,
      district: this.empForm.get('district')?.value,
      state: this.empForm.get('state')?.value,
      designation: this.empForm.get('designation')?.value,
      aadhar: this.empForm.get('aadhaar')?.value,
      pan: this.empForm.get('pan')?.value,
      mobile1: this.empForm.get('mobile1')?.value,
      mobile2: this.empForm.get('mobile2')?.value
        }
      ]
    }

    if (this.empForm.valid) {

      // this.saveEmployee.emit(this.empForm.value);
      // this.empForm.reset();
      this.apiService.addEmployee(request).subscribe({
        next:(res)=>{
          this.saveEmployee.emit(this.empForm.value);
        },
        error:(error)=>{
          console.log(error);
        }
      })
    }
  }

  onCancel() {
    this.closeForm.emit();
    this.empForm.reset();
  }
}
