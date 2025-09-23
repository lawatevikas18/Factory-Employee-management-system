import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
      const token = localStorage.getItem('token'); // ✅ Get token from localStorage (or service)
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
}