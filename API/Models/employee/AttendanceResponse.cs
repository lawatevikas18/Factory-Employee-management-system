namespace Auth.Api.Models.employee
{
    public class AttendanceResponse
    {
        public string EmployeeId { get; set; }
        public DateTime AttendanceDate { get; set; }
        public string Status { get; set; } = default!;
        public string Message { get; set; } 
    }
}
