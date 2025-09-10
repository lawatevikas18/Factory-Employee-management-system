using Auth.Api.Models;
using Auth.Api.Models.employee;
using Auth.Api.Models.reports;
using Dapper;
using System.Data;

public interface IAuthRepository
{
    Task<int> CreateUserAsync(string email, string passwordHash, string? fullName);
    Task<User?> GetUserByEmailAsync(string email);
    Task<IEnumerable<GetEmployeeListResponse>?> getEmployeeListAsync(string admin,string role);
    Task<RegistoreEmployeeResponse?> registoreEmployeeAsync(RegistoreEmployeeRequest request);
    Task<LoginResponse?> LoginAsync(LoginRequest request);
    Task<bool> SaveAttendanceAsync(AttendanceRequest request);
    Task<IEnumerable<AttendanceReportResponse>?> GetAttendanceReportAsync(AttendanceReportRequest request);
}

public class AuthRepository : IAuthRepository
{
    private readonly IDbConnectionFactory _factory;
    public AuthRepository(IDbConnectionFactory factory) => _factory = factory;

    public async Task<int> CreateUserAsync(string email, string passwordHash, string? fullName)
    {
        using var conn = _factory.CreateConnection();
        return await conn.ExecuteScalarAsync<int>("sp_RegisterUser", new
        {
            Email = email,
            PasswordHash = passwordHash,
            FullName = fullName
        }, commandType: System.Data.CommandType.StoredProcedure);
    }

    public async Task<User?> GetUserByEmailAsync(string email)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<User>("sp_GetUserByEmail", new { Email = email },
            commandType: System.Data.CommandType.StoredProcedure);
    }
    public async Task<LoginResponse?> LoginAsync(LoginRequest req)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryFirstOrDefaultAsync<LoginResponse>("sp_GetLoginAdminDetails",
            new { UserId = req.UserId,
               Password=req.Password
            },
            commandType: System.Data.CommandType.StoredProcedure);
    }
    public async Task<IEnumerable<GetEmployeeListResponse>> getEmployeeListAsync(string admin, string role)
    {
        using var conn = _factory.CreateConnection();
        return await conn.QueryAsync<GetEmployeeListResponse>(
            "sp_getEmployeeList",
            new { Admin = admin, Role = role },
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<RegistoreEmployeeResponse?> registoreEmployeeAsync(RegistoreEmployeeRequest req)
    {
        using var conn = _factory.CreateConnection();

        var emp = req.empLoyeeDetails.FirstOrDefault();
        if (emp == null) return null;

        return await conn.QueryFirstOrDefaultAsync<RegistoreEmployeeResponse>(
            "sp_registoreEmployee",
            new
            {
                AdminName = req.adminName,
                Role = req.role,
                AdminId = req.adminId,
                Action = req.action,

                FactoryName = emp.factoryName,
                EmployeeName = emp.employeeName,
                EmployeeCode = emp.employeeCode,
                Address = emp.address,
                Village = emp.village,
                Taluka = emp.taluka,
                District = emp.district,
                State = emp.state,
                Designation = emp.designation,
                Aadhar = emp.aadhar,
                Pan = emp.pan,
                Mobile1 = emp.mobile1,
                Mobile2 = emp.mobile2
            },
            commandType: CommandType.StoredProcedure
        );
    }
    public async Task<bool> SaveAttendanceAsync(AttendanceRequest req)
    {
        using var conn = _factory.CreateConnection();

        var dt = new DataTable();
        dt.Columns.Add("EmployeeId", typeof(int));
        dt.Columns.Add("AttendanceDate", typeof(DateTime));
        dt.Columns.Add("Status", typeof(string));

        foreach (var item in req.AttendanceList)
        {
            dt.Rows.Add(item.EmployeeId, item.AttendanceDate, item.Status);
        }

        var result = await conn.ExecuteAsync(
            "sp_SaveEmployeeAttendance",
            new
            {
                AttendanceList = dt.AsTableValuedParameter("EmployeeAttendanceType"),
                AdminId = req.AdminId,
                Action = req.Action
            },
            commandType: CommandType.StoredProcedure
        );

        return result > 0;
    }

    public async Task<IEnumerable<AttendanceReportResponse>> GetAttendanceReportAsync(AttendanceReportRequest request)
    {
        using var conn = _factory.CreateConnection();

        var result = await conn.QueryAsync<AttendanceReportResponse>(
            "sp_GetAttendanceReport",
            new
            {
                FromDate = string.IsNullOrWhiteSpace(request.FromDate) ? null : request.FromDate,
                ToDate = string.IsNullOrWhiteSpace(request.ToDate) ? null : request.ToDate,
                EmployeeCode = string.IsNullOrWhiteSpace(request.EmployeeCode) ? null : request.EmployeeCode,
                Day = string.IsNullOrWhiteSpace(request.Day) ? null : request.Day
            },
            commandType: CommandType.StoredProcedure
        );

        return result;
    }

}
