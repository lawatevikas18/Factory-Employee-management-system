using FEMS_API.Database;
using FEMS_API.DTOS;
using FEMS_API.Models;
using FEMS_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly FEMS_DbContext _db;
        private readonly TokenService _tokenService;
        private readonly IWebHostEnvironment _env;

        public AuthController(FEMS_DbContext db, TokenService tokenService, IWebHostEnvironment env)
        {
            _db = db;
            _tokenService = tokenService;
            _env = env;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] UserRegisterDto dto)
        {
            if (await _db.Users.AnyAsync(u => u.MobileNumber == dto.MobileNumber))
                return BadRequest("User already exists. (Mobile number already used)");
            if (await _db.Users.AnyAsync(u => u.Aadhaar == dto.Aadhaar))
                return BadRequest("User already exists. (Aadhaar number already used)");
            if (dto.Role != "Admin")
            {
                if (await _db.Users.AnyAsync(u => u.FactoryName == dto.FactoryName))
                    return BadRequest("Factory name already assigned to another user.");
            }
            

            CreatePasswordHash(dto.Password, out byte[] passwordHash, out byte[] passwordSalt);

            // ✅ Handle Image Upload
            string? imagePath = null;
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var uploadFolder = Path.Combine(_env.WebRootPath, "UserImages");
                if (!Directory.Exists(uploadFolder))
                    Directory.CreateDirectory(uploadFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.Image.FileName)}";
                var filePath = Path.Combine(uploadFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.Image.CopyToAsync(stream);
                }

                imagePath = $"/UserImages/{fileName}";
            }

            var user = new User
            {
                Name = dto.Name,
                Address = dto.Address,
                Aadhaar = dto.Aadhaar,
                PanCard = dto.PanCard,
                MobileNumber = dto.MobileNumber,
                Role = dto.Role,
                FactoryName = dto.FactoryName,
                PasswordHash = passwordHash,
                PasswordSalt = passwordSalt,
                ImagePath = imagePath
            };

            _db.Users.Add(user);

            var wallet = new UserWallet
            {
                UserId = user.UserId,
                Balance = 0
            };
            _db.UserWallets.Add(wallet);

            await _db.SaveChangesAsync();

            return Ok(new { message = "✅ User registered successfully!", image = imagePath });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto dto)
        {
            var user = await _db.Users.FirstOrDefaultAsync(u => u.MobileNumber == dto.MobileNumber);
            if (user == null) return Unauthorized("Invalid credentials");

            if (!VerifyPasswordHash(dto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid credentials");

            var token = _tokenService.GenerateToken(user);
            return Ok(new { token });
        }

        #region Password Hashing
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using var hmac = new HMACSHA512();
            passwordSalt = hmac.Key;
            passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        }

        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }
        #endregion
    }
}
