using Auth.Api.Models;
using Auth.Api.Models.employee;
using Auth.Api.Models.reports;

namespace Auth.Api.Services;

public interface IAuthService
{
    Task<int> RegisterAsync(RegisterRequest request);
    Task<LoginResponse> LoginAsync(LoginRequest request);
    Task<IEnumerable<GetEmployeeListResponse>> getEmployeeListAsync(getEmployeeListRequest request);
    Task<RegistoreEmployeeResponse> registoreEmployeeAsync(RegistoreEmployeeRequest request);
    Task<bool> SaveAttendanceAsync(AttendanceRequest request);
    Task<IEnumerable<AttendanceReportResponse>> GetAttendanceReportAsync(AttendanceReportRequest request);
}
