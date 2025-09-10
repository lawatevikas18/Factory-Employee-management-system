using Auth.Api.Models;
using Auth.Api.Models.employee;
using Auth.Api.Models.reports;
using BCrypt.Net;

namespace Auth.Api.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repo;
    private readonly IJwtTokenService _jwt;

    public AuthService(IAuthRepository repo, IJwtTokenService jwt)
    {
        _repo = repo;
        _jwt = jwt;
    }

    public async Task<int> RegisterAsync(RegisterRequest request)
    {
        var existing = await _repo.GetUserByEmailAsync(request.Email);
        if (existing != null)
            throw new Exception("Email already registered");

        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        return await _repo.CreateUserAsync(request.Email, passwordHash, request.FullName);
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        //var user = await _repo.GetUserByEmailAsync(request.Email);
        //if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        //    throw new Exception("Invalid credentials");
        var user = await _repo.LoginAsync(request);

        // var (token, expires) = _jwt.GenerateToken(user);
        //return new LoginResponse { AccessToken = token, ExpiresAt = expires };
        return user;
    }


    public async Task<IEnumerable<GetEmployeeListResponse>> getEmployeeListAsync(getEmployeeListRequest request)
    {
        var list = await _repo.getEmployeeListAsync(request.admin, request.role);
        //var (token, expires) = _jwt.GenerateToken(user);
        // return new getEmployeeListResponse { AccessToken = token, ExpiresAt = expires };
        return list;
    }

    public async Task<RegistoreEmployeeResponse> registoreEmployeeAsync(RegistoreEmployeeRequest request)
    {
        var response = await _repo.registoreEmployeeAsync(request);
        if (response == null)
            return new RegistoreEmployeeResponse
            {
                massage = "Employee code already exists",
                employeeId = null
            };

        //var (token, expires) = _jwt.GenerateToken(user);
        // return new getEmployeeListResponse { AccessToken = token, ExpiresAt = expires };
        return response;
    }

    public async Task<bool> SaveAttendanceAsync(AttendanceRequest request)
    {
        var response = await _repo.SaveAttendanceAsync(request);
        //if (response == null)
        //    return new AttendanceResponse
        //    {
        //        massage = "Employee code already exists",
        //        employeeId = null
        //    };

        //var (token, expires) = _jwt.GenerateToken(user);
        // return new getEmployeeListResponse { AccessToken = token, ExpiresAt = expires };
        return response;
    }
    public async Task<IEnumerable<AttendanceReportResponse>> GetAttendanceReportAsync(AttendanceReportRequest request)
    {
        var response = await _repo.GetAttendanceReportAsync(request);
        //if (response == null)
        //    return new AttendanceResponse
        //    {
        //        massage = "Employee code already exists",
        //        employeeId = null
        //    };

        //var (token, expires) = _jwt.GenerateToken(user);
        // return new getEmployeeListResponse { AccessToken = token, ExpiresAt = expires };
        return response;
    }
}
