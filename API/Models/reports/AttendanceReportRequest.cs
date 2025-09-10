namespace Auth.Api.Models.reports
{
    public class AttendanceReportRequest
    {
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? Day { get; set; }
        public string? EmployeeCode { get; set; }
    }
}
