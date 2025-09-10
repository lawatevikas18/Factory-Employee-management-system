export interface EmployeeAttendance {
  employeeId: number;
  status: string; // FullDay, HalfDay, Absent
  attendanceDate: string; // YYYY-MM-DD
}

export interface AttendanceRequest {
  adminId: string;
  action: string; // Insert / Update
  attendanceList: EmployeeAttendance[];
}