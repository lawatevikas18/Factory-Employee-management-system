import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';

interface Employee {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  designation: string;
  factory: string;
  salary: number;
  deposit: number;
  aadhar: string;
  carNo: string;
  panNo: string;
  mobile1: string;
  mobile2: string;
  village: string;
  taluka: string;
  district: string;
  country: string;
  state: string;
}

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.scss']
})
export class EmployeeDetailsComponent implements OnInit {
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  searchText: string = '';

  // Dropdown data
  designations = ['Worker', 'Supervisor', 'Manager', 'Driver'];
  factories = ['Factory A', 'Factory B', 'Factory C'];
  states = ['Maharashtra', 'Karnataka', 'Gujarat', 'Madhya Pradesh'];
  countries = ['India', 'Nepal', 'Bangladesh', 'Sri Lanka'];
  employeeForm!: FormGroup;
  selectedEmployee: Employee | null = null;
  isEmployeePopupOpen = false;
  isAddMode = false;
  selectedFactory: string = '';
  adminData:any
  constructor(private fb: FormBuilder,
    private  apiService: AuthService
  ) {}
  ngOnInit(): void {

    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      factory: ['', Validators.required],
      salary: [null, [Validators.required, Validators.min(5000)]],
      deposit: [0],
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      carNo: [''],
      panNo: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      mobile1: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      mobile2: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      village: ['', Validators.required],
      taluka: [''],
      district: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
    });


    // this.employees = [
    //   {
    //     id: 1,
    //     firstName: 'John',
    //     middleName: 'D.',
    //     lastName: 'Smith',
    //     designation: 'Worker',
    //     factory: 'Factory A',
    //     salary: 18000,
    //     deposit: 5000,
    //     aadhar: '1234-5678-9012',
    //     carNo: 'MH12AB1234',
    //     panNo: 'ABCDE1234F',
    //     mobile1: '9876543210',
    //     mobile2: '9123456780',
    //     village: 'Village X',
    //     taluka: 'Taluka A',
    //     district: 'Pune',
    //     country: 'India',
    //     state: 'Maharashtra'
    //   },
    //   {
    //     id: 2,
    //     firstName: 'Asha',
    //     middleName: '',
    //     lastName: 'More',
    //     designation: 'Supervisor',
    //     factory: 'Factory B',
    //     salary: 22000,
    //     deposit: 7000,
    //     aadhar: '2345-6789-0123',
    //     carNo: 'MH14XY4567',
    //     panNo: 'FGHIJ5678K',
    //     mobile1: '9001234567',
    //     mobile2: '9823456789',
    //     village: 'Village Y',
    //     taluka: 'Taluka B',
    //     district: 'Solapur',
    //     country: 'India',
    //     state: 'Maharashtra'
    //   }
    // ];
    // this.filteredEmployees = [...this.employees];
    this.getEmployeeDetails()
  }


  getEmployeeDetails(){
   let request ={
      "admin":this.adminData.adminName,
      "role": this.adminData.role
    }
    this.apiService.getEmpListDetails(request).subscribe({
      next:(res)=>{
        console.log(res);
       this.employees=res;
      },
      error:(error)=>{
     console.log(error);
    

      }
    })
  }
  openAddEmployeePopup() {
    this.selectedEmployee = {
      id: 0,
      firstName: '',
      middleName: '',
      lastName: '',
      designation: '',
      factory: '',
      salary: 0,
      deposit: 0,
      aadhar: '',
      carNo: '',
      panNo: '',
      mobile1: '',
      mobile2: '',
      village: '',
      taluka: '',
      district: '',
      country: '',
      state: ''
    };
    this.isAddMode = true;
    this.isEmployeePopupOpen = true;
    this.employeeForm.reset();

  }

  openEditEmployee(emp: Employee) {
    this.selectedEmployee = { ...emp };
    this.isAddMode = false;
    this.isEmployeePopupOpen = true;
    this.employeeForm.patchValue(emp);

  }

  closeEmployeePopup() {
    this.isEmployeePopupOpen = false;
  }

  saveEmployee() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const employeeData = this.employeeForm.value;

    if (this.isAddMode) {
      employeeData.id = this.employees.length + 1;
      this.employees.push(employeeData);
    } else {
      const index = this.employees.findIndex(e => e.id === employeeData.id);
      if (index !== -1) this.employees[index] = employeeData;
    }

    this.closeEmployeePopup();
  }

  trackByEmployee(index: number, emp: Employee) {
    return emp.id;
  }

  confirmDeleteEmployee(emp: Employee) {
    const confirmed = confirm(`Are you sure you want to delete ${emp.firstName} ${emp.lastName}?`);
    if (confirmed) {
      this.deleteEmployee(emp);
    }
  }

  deleteEmployee(emp: Employee) {
    this.employees = this.employees.filter(e => e.id !== emp.id);
    this.filteredEmployees = [...this.employees];
  }

  filterEmployees() {
    const text = this.searchText.toLowerCase();
    const factory = this.selectedFactory;

    this.filteredEmployees = this.employees.filter(emp =>
      (emp.firstName.toLowerCase().includes(text) ||
       emp.lastName.toLowerCase().includes(text) ||
       emp.designation.toLowerCase().includes(text) ||
       emp.factory.toLowerCase().includes(text)) &&
      (factory === '' || emp.factory === factory)
    );
  }

  get f() {
    return this.employeeForm.controls;
  }
}

