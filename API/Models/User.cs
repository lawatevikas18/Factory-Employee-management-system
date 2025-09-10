namespace Auth.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string? FullName { get; set; }
}
//public class LoginResponse
//{
//    public int Id { get; set; }
//    public string Email { get; set; } = default!;
//    public string Role { get; set; } = default!;
//    public string? FullName { get; set; }
//    public string? MobileNo { get; set; }
//}