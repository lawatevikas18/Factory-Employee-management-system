import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';

export interface Attendance {
  attendanceId?: number;
  employeeId: number;
  status: 'Present' | 'Absent' | 'HalfDay' | 'Leave';
  date: string;
  userId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private baseUrl = `${environment.apiUrl}/Attendance`;
private getHeaders() {
      const token = sessionStorage.getItem('token'); // ✅ Get token from sessionStorage (or service)
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  constructor(private http: HttpClient) {}

  // getAll(): Observable<Attendance[]> {
  //   return this.http.get<Attendance[]>(`${this.baseUrl}/StatusByDate?date=${date}`,{ headers: this.getHeaders() });
  // }
getAll(date: any): Observable<any[]> {

    return this.http.get<any[]>(`${this.baseUrl}/StatusByDate?date=${date}`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<Attendance> {
    return this.http.get<Attendance>(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }

  add(attendance: Attendance): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add`, attendance,{ headers: this.getHeaders() });
  }

  update(attendance: Attendance): Observable<any> {
    return this.http.put(`${this.baseUrl}/${attendance.attendanceId}`, attendance,{ headers: this.getHeaders() });
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`,{ headers: this.getHeaders() });
  }

  getTodayCount(): Observable<any> {
    return this.http.get(`${this.baseUrl}/TodayCount`,{ headers: this.getHeaders() });
  }
  saveAttendance(attendance: Attendance): Observable<any> {
    return this.http.post(`${this.baseUrl}/Add`, attendance,{ headers: this.getHeaders() });
  }
  // getAllAttendence(date: any): Observable<any[]> {

  //   return this.http.get<any[]>(`${this.baseUrl}`, { headers: this.getHeaders() });
  // }

  getAllAttendence(employeeId?: any, fromDate?: any, toDate?: any): Observable<any[]> {
    let params = new HttpParams();

    if (employeeId) params = params.set('employeeId', employeeId.toString());
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<Attendance[]>(this.baseUrl, { params,headers: this.getHeaders() });
  }
  getAllAttendencePDF(employeeId?: any, fromDate?: any, toDate?: any): Observable<any[]> {
    let params = new HttpParams();

    if (employeeId) params = params.set('employeeId', employeeId.toString());
    if (fromDate) params = params.set('fromDate', fromDate);
    if (toDate) params = params.set('toDate', toDate);

    return this.http.get<Attendance[]>(`${this.baseUrl}/downloadPdf`, { params,headers: this.getHeaders() });
  }
}