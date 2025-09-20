using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Numerics;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // ✅ Require JWT token
    public class UserController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public UserController(FEMS_DbContext context)
        {
            _context = context;
        }

        // ✅ Helper property for Role
        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? throw new UnauthorizedAccessException("Role claim missing");

        // ✅ Admin check method
        private bool IsAdmin => CurrentRole == "Admin";

        // GET: api/User (✅ Admin Only)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view all users.");

            return await _context.Users.ToListAsync();
        }

        [HttpGet("UserWallet/{userId}")]
        public async Task<ActionResult<UserWallet>> GetUsersWallet(int userId)
        {
            if (!IsAdmin)
                return Forbid("Only admin can view user wallets.");

            var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == userId);
            if (userWallet == null) return NotFound();

            return Ok(userWallet);
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (!IsAdmin)
                return Forbid("Only admin can view user details.");

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();
            return user;
        }

        // POST: api/User (✅ Admin Only)
        [HttpPost]
        public async Task<ActionResult<User>> AddUser(User user)
        {
            if (!IsAdmin)
                return Forbid("Only admin can create users.");

            // ✅ Check duplicate Aadhaar
            var existingAadhaar = await _context.Users
                .FirstOrDefaultAsync(u => u.Aadhaar == user.Aadhaar);
            if (existingAadhaar != null)
                return Conflict(new { message = "User with this Aadhaar already exists." });

            // ✅ Check duplicate MobileNumber
            var existingMobile = await _context.Users
                .FirstOrDefaultAsync(u => u.MobileNumber == user.MobileNumber);
            if (existingMobile != null)
                return Conflict(new { message = "User with this Mobile Number already exists." });

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // ✅ Create Wallet for User
            var wallet = new UserWallet
            {
                UserId = user.UserId,
                Balance = 0
            };
            _context.UserWallets.Add(wallet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, user);
        }

        // PUT: api/User/5 (✅ Admin Only)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, User user)
        {
            if (!IsAdmin)
                return Forbid("Only admin can update users.");

            if (id != user.UserId) return BadRequest();

            // ✅ Check duplicates (excluding current user)
            var duplicateAadhaar = await _context.Users
                .AnyAsync(u => u.Aadhaar == user.Aadhaar && u.UserId != id);
            if (duplicateAadhaar)
                return Conflict(new { message = "Another user with this Aadhaar already exists." });

            var duplicateMobile = await _context.Users
                .AnyAsync(u => u.MobileNumber == user.MobileNumber && u.UserId != id);
            if (duplicateMobile)
                return Conflict(new { message = "Another user with this Mobile Number already exists." });

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Users.Any(u => u.UserId == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/User/5 (✅ Admin Only)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (!IsAdmin)
                return Forbid("Only admin can delete users.");

            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound();

            // ✅ Remove Wallet
            var wallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == id);
            if (wallet != null)
                _context.UserWallets.Remove(wallet);

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(user);
        }

        [HttpGet("User_wallete")]

        public async Task<ActionResult<IEnumerable<UserWallet>>> getuserwalletes()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view user details.");

            var userwallete = await _context.UserWallets.ToListAsync();
            if (userwallete == null) return NotFound();
            return userwallete;
             
        }

        [HttpGet("employee_wallete")]

        public async Task<ActionResult<IEnumerable<EmployeeWallet>>> getemployeewalletes()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view employee details.");

            var employeewallete = await _context.EmployeeWallets.ToListAsync();

            if (employeewallete == null) return NotFound();
            return employeewallete;

        }

        [HttpGet("Admin_wallete")]

        public async Task<ActionResult<IEnumerable<AdminWallet>>> geteadminwalletes()
        {
            if (!IsAdmin)
                return Forbid("Only admin can view employee details.");

            var adminwallete = await _context.AdminWallets.ToListAsync();

            if (adminwallete == null) return NotFound();
            return adminwallete;

        }

    }
}
