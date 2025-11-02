import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-factory-detail',
  templateUrl: './factory-detail.component.html',
  styleUrls: ['./factory-detail.component.scss']
})
export class FactoryDetailComponent implements OnInit {
  baseUrl = `${environment.apiUrl}/FactoryDetail`; // 🔹 Change API port if needed
                              
  factoryList: any[] = [];
  filteredList: any[] = [];
  searchTerm: string = '';
  selected: any = null;
  loading = false;

     private getHeaders() {
        const token = sessionStorage.getItem('token'); // ✅ Get token from sessionStorage (or service)
        return new HttpHeaders({
          'Authorization': `Bearer ${token}`
        });
      }

  fieldList = [
    { key: 'Address', label: 'Address' },
    { key: 'Description', label: 'Description' },
    { key: 'GSTIN', label: 'GSTIN' },
    { key: 'PANNo', label: 'PAN No' },
    { key: 'StateCode', label: 'State Code' },
    { key: 'State', label: 'State' },
    { key: 'InvoiceNo', label: 'Invoice No' },
    { key: 'WorkOrderNo', label: 'Work Order No' },
    { key: 'CustomerName', label: 'Customer Name' },
    { key: 'CustomerAddress', label: 'Customer Address' },
    { key: 'CustomerGSTIN', label: 'Customer GSTIN' },
    { key: 'CustomerState', label: 'Customer State' },
    { key: 'CustomerStateCode', label: 'Customer State Code' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.http.get<any[]>(this.baseUrl,{ headers: this.getHeaders() }).subscribe({
      next: (res:any) => {
        this.factoryList = res.data;
        this.filteredList = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load data', 'error');
      }
    });
  }

  filterData() {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.factoryList.filter(
      f =>
        f.FactoryName?.toLowerCase().includes(term) ||
        f.Address?.toLowerCase().includes(term) ||
        f.CustomerName?.toLowerCase().includes(term) ||
        f.GSTIN?.toLowerCase().includes(term)
    );
  }

  addNew() {
    this.selected = {
      Address: '', Description: '', GSTIN: '', PANNo: '',
      StateCode: '', State: '', InvoiceNo: '', WorkOrderNo: '',
      CustomerName: '', CustomerAddress: '', CustomerGSTIN: '',
      CustomerState: '', CustomerStateCode: ''
    };
  }

  editItem(item: any) {
    this.selected = { ...item };
  }

  deleteItem(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This record will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        this.http.delete(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() }).subscribe({
          next: () => {
            Swal.fire('Deleted', 'Factory detail deleted successfully.', 'success');
            this.loadData();
          },
          error: () => Swal.fire('Error', 'Unable to delete record.', 'error')
        });
      }
    });
  }

  save() {
    if (this.selected.factorydetailsID) {
      // Update existing record
      this.http.put(`${this.baseUrl}/${this.selected.factorydetailsID}`, this.selected,{ headers: this.getHeaders() }).subscribe({
        next: () => {
          Swal.fire('Updated', 'Factory detail updated successfully.', 'success');
          this.selected = null;
          this.loadData();
        },
        error: () => Swal.fire('Error', 'Update failed', 'error')
      });
    } else {
      // Create new record
      this.http.post(this.baseUrl, this.selected,{ headers: this.getHeaders() }).subscribe({
        next: () => {
          Swal.fire('Added', 'Factory detail added successfully.', 'success');
          this.selected = null;
          this.loadData();
        },
        error: () => Swal.fire('Error', 'Failed to add record', 'error')
      });
    }
  }

  cancel() {
    this.selected = null;
  }
}
