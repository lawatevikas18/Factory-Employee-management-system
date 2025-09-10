using Auth.Api.Models;

namespace Auth.Api.Services;

public interface IJwtTokenService
{
    (string token, DateTime expiresAt) GenerateToken(User user);
}
