import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
 
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { Attendance, AttendanceDTO } from 'src/app/component/attendance/attendance.component';
 
 

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private base = `${environment.apiUrl}/api/Attendance`;

  constructor(private http: HttpClient) {}

  // GET with filters
  getAttendances(filters?: {
    id?: number;
    employeeId?: number;
    from?: string; // yyyy-MM-dd
    to?: string;   // yyyy-MM-dd
    today?: boolean;
  }): Observable<any> {
    let params = new HttpParams();
    if (!filters) filters = {};
    if (filters.id != null) params = params.set('id', String(filters.id));
    if (filters.employeeId != null) params = params.set('employeeId', String(filters.employeeId));
    if (filters.from) params = params.set('from', filters.from);
    if (filters.to) params = params.set('to', filters.to);
    if (filters.today === true) params = params.set('today', 'true');
    return this.http.get<any>(this.base, { params });
  }

  // POST single or bulk
  addAttendance(payload: AttendanceDTO | AttendanceDTO[]): Observable<any> {
    return this.http.post<any>(this.base, payload);
  }

  // PUT update
  updateAttendance(id: number, payload: Partial<Attendance>): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, payload);
  }

  // DELETE bulk by ids
  deleteAttendances(ids: number[]): Observable<any> {
    // build query string ?ids=1&ids=2
    let params = '';
    ids.forEach(id => (params += `ids=${id}&`));
    if (params.endsWith('&')) params = params.slice(0, -1);
    const url = `${this.base}${params ? '?' + params : ''}`;
    return this.http.delete<any>(url);
  }
}
