import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, finalize, of } from 'rxjs';
import { environment } from 'src/environment/environment';
import Swal from 'sweetalert2';

interface UserRow {
  Userid: number;
  Name: string;
  Address?: string;
  Role?: string;
  Aadhaar?: string;
  PanCard?: string;
  MobileNumber?: string;
  FactoryName?: string;
  ImagePath?: string;
  AdvanceBalance?: number | null;
  createdAT?: string;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  apiBase = `${environment.apiUrl}/User`;

  allUsers: UserRow[] = [];
  supervisedData: UserRow[] = [];
  adminWallets: UserRow[] = [];

  activeTab: 'supervised' | 'admin' = 'supervised';
  loading = false;
  error: string | null = null;
  search = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {

  if (sessionStorage.getItem('role') != 'Admin') { Swal.fire('Access Denied', 'Only for Admin.', 'warning'); return; }
    
    this.loadActiveTab();
  }

  setTab(tab: 'supervised' | 'admin') {
    this.activeTab = tab;
    this.search = '';
    this.loadActiveTab();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('token');
    return new HttpHeaders({ Authorization: token ? `Bearer ${token}` : '' });
  }

  private loadActiveTab() {
  if (sessionStorage.getItem('role') != 'Admin') { Swal.fire('Access Denied', 'Only for Admin.', 'warning'); return; }

    this.error = null;
    if (this.activeTab === 'supervised') this.fetchSupervised();
    else this.fetchAdminWallets();
  }


  private fetchSupervised() {
  if (sessionStorage.getItem('role') != 'Admin') { Swal.fire('Access Denied', 'Only for Admin.', 'warning'); return; }

    this.loading = true;
    this.http.get<any[]>(`${this.apiBase}/superwisedata`, { headers: this.getHeaders() })
      .pipe(
        catchError(err => { this.error = this._friendlyError(err); return of([]); }),
        finalize(() => this.loading = false)
      )
      .subscribe(data => {
        this.supervisedData = data.map(u => this.mapUser(u));
      });
  }

  private fetchAdminWallets() {

    this.loading = true;
    this.http.get<any[]>(`${this.apiBase}/Admin_wallete`, { headers: this.getHeaders() })
      .pipe(
        catchError(err => { this.error = this._friendlyError(err); return of([]); }),
        finalize(() => this.loading = false)
      )
      .subscribe(data => {
        this.adminWallets = data.map(u => this.mapUser(u));
      });
  }

  private mapUser(u: any): UserRow {
    return {
      Userid: u.userId,
      Name: u.name,
      Address: u.address,
      Role: u.role ?? '',
      Aadhaar: u.aadhaar,
      PanCard: u.panCard ?? '',
      MobileNumber: u.mobileNumber ?? '',
      FactoryName: u.factoryName ?? '',
      ImagePath: u.imagePath ?? '',
      AdvanceBalance: u.advanceBalance ?? 0,
      createdAT: u.createdAT
    };
  }

  get filteredRows(): UserRow[] {
    const q = this.search.trim().toLowerCase();
    const source =  this.activeTab === 'supervised' ? this.supervisedData
                 : this.adminWallets;
    if (!q) return source;
    return source.filter(r =>
      (r.Name || '').toLowerCase().includes(q) ||
      (r.FactoryName || '').toLowerCase().includes(q) ||
      (r.MobileNumber || '').toLowerCase().includes(q) ||
      (String(r.Userid) || '').includes(q)
    );
  }

  

  exportCsv() {
  const rows = this.filteredRows;
  if (!rows.length) return;

  const headers = [
    'UserId','Name','Role','FactoryName','Mobile','AdvanceBalance',
    'Address','Aadhaar','PanCard','ImagePath','CreatedAt'
  ];

  const csv = [headers.join(',')].concat(
    rows.map(r => [
      r.Userid,
      this._escape(r.Name),
      this._escape(r.Role),
      this._escape(r.FactoryName),
      this._escape(r.MobileNumber),
      r.AdvanceBalance ?? '',
      this._escape(r.Address),
      this._escape(r.Aadhaar),
      this._escape(r.PanCard),
      this._escape(r.ImagePath),
      this._escape(r.createdAT)
    ].join(','))
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `fems_users_${this.activeTab}_${new Date().toISOString()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}


  private _escape(v?: any) {
    if (v == null) return '';
    return `"${String(v).replace(/"/g,'""')}"`;
  }

  private _friendlyError(err: any) {
    if (!err) return 'Unknown error';
    if (err.status === 403) return 'Access denied. Admin only.';
    if (err.status === 401) return 'Unauthorized. Login again.';
    if (err.message) return err.message;
    return 'Server error';
  }

}
