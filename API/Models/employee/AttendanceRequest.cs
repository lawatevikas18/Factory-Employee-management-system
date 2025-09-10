namespace Auth.Api.Models.employee
{
    public class AttendanceRequest
    {
        public string AdminId { get; set; } = default!;
        public string Action { get; set; } 
        public List<EmployeeAttendanceDto> AttendanceList { get; set; } = new();
    }

    public class EmployeeAttendanceDto
    {
        public int EmployeeId { get; set; }
        public string Status { get; set; } // FullDay, HalfDay, Absent
        public DateTime AttendanceDate { get; set; } 
    }
}
