namespace Auth.Api.Models.reports
{
    public class AttendanceReportResponse
    {
        public string EmployeeCode { get; set; } = default!;
        public string EmployeeName { get; set; } = default!;
        public string Designation { get; set; } = default!;
        public DateTime ReportDate { get; set; }
        public string Status { get; set; } = default!;

        // 🔹 Extra fields for PDF
        public string FactoryName { get; set; } = "Shri Vitthal Co-op Sugar Factory Ltd., Venunagar - Gursale";
        public string Location { get; set; } = "Tal. Pandharpur, Dist. Solapur";
        public string PreparedBy { get; set; } = "HR Department";
        public string ApprovedBy { get; set; } = "Factory Manager";
    }
}
