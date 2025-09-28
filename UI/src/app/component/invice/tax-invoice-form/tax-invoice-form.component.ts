import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from 'src/app/core/services/invoice.service';
import { InvoiceFormData, InvoiceTotals } from 'src/app/model/invoice.model';

@Component({
  selector: 'app-tax-invoice-form',
  templateUrl: './tax-invoice-form.component.html',
  styleUrls: ['./tax-invoice-form.component.css']
})
export class TaxInvoiceFormComponent implements OnInit {
  invoiceForm!: FormGroup;
  factoryDetailsForm!: FormGroup;
  itemDetailsForm!:FormGroup;
  showPreview = false;
  invoiceData: InvoiceFormData | null = null;
  showItemForm:boolean=false
  showFactoryDetalsForm:boolean=false

  constructor(private fb: FormBuilder,
    private invoiceService:InvoiceService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadAll()
  }

  private initializeForm(): void {
    this.invoiceForm = this.fb.group({
      // Company Information
      companyName: ['NAGAPPA KANTEPPA SHIVUR', Validators.required],
      address: ['At. Post. Chandkavathe, Tal. Sindagi, Dist. Vijayapur - 586128', Validators.required],
      description: ['Sugar House & Sugar Godwn Work Bill', Validators.required],
      gstin: ['29ANAPS7778BZZR', Validators.required],
      panNo: ['ANAPS7771B', Validators.required],
      stateCode: ['29', Validators.required],
      state: ['KARNATAKA', Validators.required],

      // Invoice Details
      invoiceNo: ['25', Validators.required],
      invoiceDate: ['2025-11-25', Validators.required],
      workOrderNo: ['100/F', Validators.required],
      workingPeriodFrom: ['', Validators.required],
      workingPeriodTo: ['', Validators.required],

      // Customer Information
      customerName: ['Directeur Sukhoi Kausthanu Uri', Validators.required],
      customerAddress: ['Gokikarirama - Tal Sindagi', Validators.required],
      customerGstin: ['27AAOCP5704 DXZ1', Validators.required],
      customerState: ['Maharashtra', Validators.required],
      customerStateCode: ['27', Validators.required],

      // Tax Configuration
      igstRate: [null],
      cgstRate: [null, [Validators.min(0), Validators.max(100)]],
      sgstRate: [null, [Validators.min(0), Validators.max(100)]],

      // Items
      items: this.fb.array([])
    });

    this.factoryDetailsForm = this.fb.group({
      // Company Information
      companyName: ['NAGAPPA KANTEPPA SHIVUR', Validators.required],
      address: ['At. Post. Chandkavathe, Tal. Sindagi, Dist. Vijayapur - 586128', Validators.required],
      description: ['Sugar House & Sugar Godwn Work Bill', Validators.required],
      gstin: ['29ANAPS7778BZZR', Validators.required],
      panNo: ['ANAPS7771B', Validators.required],
      stateCode: ['29', Validators.required],
      state: ['KARNATAKA', Validators.required],

      // Invoice Details
      invoiceNo: ['25', Validators.required],
     
      workOrderNo: ['100/F', Validators.required],
     

      // Customer Information
      // customerName: ['Directeur Sukhoi Kausthanu Uri', Validators.required],
      // customerAddress: ['Gokikarirama - Tal Sindagi', Validators.required],
      // customerGstin: ['27AAOCP5704 DXZ1', Validators.required],
      // customerState: ['Maharashtra', Validators.required],
      // customerStateCode: ['27', Validators.required],

    
      
    });
    this.itemDetailsForm = this.fb.group({
     items: this.fb.array([])

    });
    // Add initial item
    this.addItem();

    // Subscribe to form changes for auto-calculation
    this.invoiceForm.valueChanges.subscribe(() => {
      // Auto-calculation happens in getter
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  // Get a specific item FormGroup with proper typing
  getItemFormGroup(index: number): FormGroup {
    return this.items.at(index) as FormGroup;
  }

  get totals(): InvoiceTotals {
    const items = this.items.value;
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const igstRate = this.invoiceForm.get('igstRate')?.value || 0;
    const cgstRate = this.invoiceForm.get('cgstRate')?.value;
    const sgstRate = this.invoiceForm.get('sgstRate')?.value;

    const igstAmount = (subtotal * igstRate) / 100;
    const cgstAmount = cgstRate ? (subtotal * cgstRate) / 100 : 0;
    const sgstAmount = sgstRate ? (subtotal * sgstRate) / 100 : 0;
    const total = subtotal + igstAmount + cgstAmount + sgstAmount;

    return {
      subtotal,
      igstAmount,
      cgstAmount: cgstRate ? cgstAmount : undefined,
      sgstAmount: sgstRate ? sgstAmount : undefined,
      total
    };
  }

  createItemFormGroup(): FormGroup {
    const srNo = this.items.length + 1;
    const itemGroup = this.fb.group({
      srNo: [srNo],
      description: ['', Validators.required],
      serviceCode: [''],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unit: ['MT', Validators.required],
      rate: [0, [Validators.required, Validators.min(0)]],
      amount: [0],
      itemCode: [0]
    });

    // Setup auto-calculation for this item
    const quantityControl = itemGroup.get('quantity');
    const rateControl = itemGroup.get('rate');
    const amountControl = itemGroup.get('amount');

    const calculateAmount = () => {
      const quantity = quantityControl?.value || 0;
      const rate = rateControl?.value || 0;
      const amount = quantity * rate;
      amountControl?.setValue(amount, { emitEvent: false });
    };

    quantityControl?.valueChanges.subscribe(() => calculateAmount());
    rateControl?.valueChanges.subscribe(() => calculateAmount());

    return itemGroup;
  }

  addItem(): void {
    const itemGroup = this.createItemFormGroup();
    
    // Set default values for first item
    if (this.items.length === 0) {
      itemGroup.patchValue({
        description: 'Sugar cane crushing and juice extraction services',
        serviceCode: '14576',
        quantity: 3.70,
        rate: 53.93,
        amount: 199.54
      });
    }

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.renumberItems();
    }
  }

  private renumberItems(): void {
    this.items.controls.forEach((control, index) => {
      control.get('srNo')?.setValue(index + 1);
    });
  }

  onPreviewInvoice(): void {
    console.log("invoice data"+this.invoiceData)
    if (this.invoiceForm.valid) {
      this.invoiceData = this.invoiceForm.value;
      this.showPreview = true;
    } else {
      this.markFormGroupTouched(this.invoiceForm);
    }
  }

  onBackToForm(): void {
    this.showPreview = false;
  }

  onPrintInvoice(): void {
    window.print();
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        control.controls.forEach(arrayControl => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  // Utility methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.invoiceForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isItemFieldInvalid(itemIndex: number, fieldName: string): boolean {
    const field = this.getItemFormGroup(itemIndex).get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.invoiceForm.get(fieldName);
    if (field?.hasError('required')) {
      return 'This field is required';
    }
    if (field?.hasError('min')) {
      return 'Value must be greater than or equal to 0';
    }
    if (field?.hasError('max')) {
      return 'Value must be less than or equal to 100';
    }
    return '';
  }

  addFactoryDetails(){
this.showFactoryDetalsForm=true
this.showItemForm=false
  }
  addItems(){
this.showFactoryDetalsForm=false
this.showItemForm=true
  }
  onsubmitinfo(){
this.showFactoryDetalsForm=false
  }

  calcel(){
    this.showFactoryDetalsForm=false
  }

  calcelIemForm(){
    this.showItemForm=false
  }
  onsubmitIteminfo(){
this.showItemForm=false
  }

  loadAll() {
    
    this.invoiceService.getAll()
      .subscribe({
        next: (list) => ( console.log(list)),
        // error: (err) => alert(err?.message || 'Failed to load invoices')
      });
  }
}