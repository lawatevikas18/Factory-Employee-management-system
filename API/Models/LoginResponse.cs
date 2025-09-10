namespace Auth.Api.Models;

public class LoginResponse
{
   // public string AccessToken { get; set; } = default!;
   // public DateTime ExpiresAt { get; set; }

    public string adminName { get; set; } 
    public string adminId { get; set; }
    public string role { get; set; }
}
