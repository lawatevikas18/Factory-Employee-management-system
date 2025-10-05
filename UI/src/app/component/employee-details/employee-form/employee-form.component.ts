// employee-form.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/model/employee.model';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnChanges {
  @Input() isAddMode = true;
  @Input() employee: Employee | null = null;
  @Input() designations: string[] = [];
  @Input() factories: string[] = [];
  @Input() states: string[] = [];
  @Input() countries: string[] = [];

  @Output() save = new EventEmitter<Employee>();
  @Output() close = new EventEmitter<void>();

  employeeForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      id: [0],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      designation: ['', Validators.required],
      factory: ['', Validators.required],
      salary: [null, Validators.required],
      deposit: [0],
      aadhar: ['', [Validators.required, Validators.pattern(/^\d{12}$/)]],
      carNo: [''],
      panNo: ['', [Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
      mobile1: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      mobile2: ['',],
      village: ['', Validators.required],
      taluka: [''],
      district: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
    });
  }

  // 🔹 Runs whenever inputs change
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employee'] && this.employee) {
      this.employeeForm.patchValue(this.employee); // load data into form
    }
  }

  onSave() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    this.save.emit(this.employeeForm.value);

    
  }

  onClose() {
    this.close.emit();
  }

  get f() {
    return this.employeeForm.controls;
  }
}
