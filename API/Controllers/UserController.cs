using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public UserController(FEMS_DbContext context)
        {
            _context = context;
        }

        // Current user's role
        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "User"; // fallback avoids crash

        private bool IsAdmin => CurrentRole == "Admin";

        // GET: api/User
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetUsers()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view all users.");

            var users = await _context.Users
                .Select(u => new
                {
                    u.UserId,
                    u.Name,
                    u.Address,
                    u.Aadhaar,
                    u.PanCard,
                    u.MobileNumber,
                    u.Role,
                    u.FactoryName,
                    u.ImagePath,
                    u.createdAT
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/User/superwisedata
        [HttpGet("superwisedata")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserWallets()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view user details.");

            var users = await _context.Users
                .Select(e => new
                {
                    Userid = e.UserId,
                    e.Name,
                    e.Address,
                    e.Role,
                    e.Aadhaar,
                    e.PanCard,
                    e.MobileNumber,
                    e.FactoryName,
                    e.ImagePath,
                    AdvanceBalance = _context.UserWallets
                        .Where(w => w.UserId == e.UserId)
                        .Select(w => w.Balance)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
        }

        // GET: api/User/Admin_wallete
        [HttpGet("Admin_wallete")]
        public async Task<ActionResult<IEnumerable<object>>> GetAdminWallets()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view employee details.");

            var users = await _context.Users
                .Where(e => e.Role == "Admin")
                .Select(e => new
                {
                    Userid = e.UserId,
                    e.Name,
                    e.Address,
                    e.Role,
                    e.Aadhaar,
                    e.PanCard,
                    e.MobileNumber,
                    e.FactoryName,
                    e.ImagePath,
                    AdvanceBalance = _context.UserWallets
                        .Where(w => w.UserId == e.UserId)
                        .Select(w => w.Balance)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}
