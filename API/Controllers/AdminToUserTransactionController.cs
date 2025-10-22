using FEMS_API.Database;
using FEMS_API.DTOS;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AdminToUserTransactionController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public AdminToUserTransactionController(FEMS_DbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException("UserId claim missing."));

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // ✅ Get all transactions (Admin only)
        [HttpGet("All")]
        public async Task<ActionResult> GetAllTransactions()
        {
            if (CurrentRole != "Admin")
                return BadRequest(new { message = "❌ Only Admin can view transactions." });

            var transactions = await _context.AdminToUserTransactions.ToListAsync();
            return Ok(new { message = "✅ Transactions fetched successfully.", data = transactions });
        }

        // ✅ Dashboard stats (Admin & Supervisor)
        [HttpGet("DashboardStats")]
        public async Task<ActionResult> GetDashboardStats()
        {
            var today = DateTime.Today;
            var user = await _context.Users.FindAsync(CurrentUserId);
            if (user == null) return NotFound(new { message = "User not found." });

            if (CurrentRole == "Admin")
            {
                var totalUsers = await _context.Users.CountAsync();
                var totalEmployees = await _context.Employees.CountAsync();
                var totalbalance = await _context.UserWallets.FirstOrDefaultAsync(u => u.UserId == CurrentUserId);

                var factoryWisePresent = await (from e in _context.Employees
                                                join a in _context.Attendances.Where(x => x.Date.Date == today && x.Status == "Present")
                                                    on e.EmployeeId equals a.EmployeeId
                                                group e by e.FactoryName into g
                                                select new
                                                {
                                                    FactoryName = g.Key,
                                                    PresentCount = g.Count()
                                                }).ToListAsync();

                return Ok(new
                {
                    message = "✅ Dashboard data fetched successfully.",
                    role = CurrentRole,
                    UserName = user.Name,
                    factoryName = user.FactoryName,
                    employee_count = totalEmployees,
                    attendance_count_today = factoryWisePresent.Sum(x => x.PresentCount),
                    active_site = factoryWisePresent,
                    total_site = totalUsers,
                    total_balance = totalbalance?.Balance ?? 0
                });
            }
            else
            {
                var myEmployeesCount = await _context.Employees.CountAsync(e => e.UserId == CurrentUserId);
                var totalbalance = await _context.UserWallets.FirstOrDefaultAsync(u => u.UserId == CurrentUserId);

                var factoryWisePresent = await (from e in _context.Employees.Where(x => x.UserId == CurrentUserId)
                                                join a in _context.Attendances.Where(x => x.Date.Date == today && x.Status == "Present")
                                                    on e.EmployeeId equals a.EmployeeId
                                                group e by e.FactoryName into g
                                                select new
                                                {
                                                    FactoryName = g.Key,
                                                    PresentCount = g.Count()
                                                }).ToListAsync();

                return Ok(new
                {
                    message = "✅ Dashboard data fetched successfully.",
                    role = CurrentRole,
                    UserName = user.Name,
                    factoryName = user.FactoryName,
                    employee_count = myEmployeesCount,
                    attendance_count_today = factoryWisePresent.Sum(x => x.PresentCount),
                    active_site = factoryWisePresent,
                    total_site = 1,
                    total_balance = totalbalance?.Balance ?? 0
                });
            }
        }

        // ✅ Get Admin Wallet
        [HttpGet("AdminWallet/{adminId}")]
        public async Task<ActionResult> GetAdminWallet(int adminId)
        {
            if (CurrentRole != "Admin")
                return BadRequest(new { message = "❌ Only Admin can perform this action." });

            var adminWallet = await _context.UserWallets.FirstOrDefaultAsync(x => x.UserId == adminId);
            if (adminWallet == null)
                return NotFound(new { message = "Admin wallet not found." });

            return Ok(new { message = "✅ Admin wallet fetched successfully.", data = adminWallet });
        }

        // ✅ Get user transactions with running balance
        [HttpGet("UserTransactions/{userId}")]
        public async Task<ActionResult> GetUserTransactionsWithBalance(int userId)
        {
            if (CurrentRole != "Admin")
                return BadRequest(new { message = "❌ Only Admin can perform this action." });

            var transactions = await _context.AdminToUserTransactions
                .Where(t => t.UserId == userId)
                .Join(_context.Admins,
                      t => t.AdminId,
                      a => a.AdminId,
                      (t, a) => new
                      {
                          t.TransactionId,
                          AdminName = a.Name,
                          t.Amount,
                          t.Reason,
                          t.Date_of_transfer
                      })
                .OrderBy(t => t.Date_of_transfer)
                .ToListAsync();

            if (transactions.Count == 0)
                return NotFound(new { message = "No transactions found for this user." });

            decimal runningTotal = 0;
            var result = transactions.Select(t =>
            {
                runningTotal += t.Amount;
                return new
                {
                    t.TransactionId,
                    t.AdminName,
                    t.Amount,
                    t.Reason,
                    t.Date_of_transfer,
                    RunningTotal = runningTotal
                };
            }).OrderByDescending(t => t.Date_of_transfer);

            return Ok(new { message = "✅ User transactions fetched successfully.", data = result });
        }

        // ✅ New Endpoint: Get User Details + Wallet Balance
        [HttpGet("UserDetails/{userId}")]
        public async Task<ActionResult> GetUserDetailsWithWallet(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null) return NotFound(new { message = "User not found." });

            var wallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == userId);

            return Ok(new
            {
                message = "✅ User details fetched successfully.",
                user = new
                {
                    user.UserId,
                    user.Name,
                    user.MobileNumber,
                    user.FactoryName,
                    user.Role
                },
                wallet = new
                {
                    Balance = wallet?.Balance ?? 0,
                    LastUpdated = wallet?.CreatedAT
                }
            });
        }

        // ✅ Send Money (Admin to User)
        [HttpPost("SendMoney")]
        public async Task<ActionResult> SendMoney(AdminToUser_transferDTO transaction)
        {
            if (CurrentRole != "Admin")
                return BadRequest(new { message = "❌ Only Admin can perform this action." });

            var adminWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == CurrentUserId);
            if (adminWallet == null)
                return BadRequest(new { message = "Admin wallet not found." });

            if (adminWallet.Balance < transaction.Amount)
                return BadRequest(new { message = "Insufficient balance in Admin wallet." });

            var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == transaction.UserId);
            if (userWallet == null)
                return BadRequest(new { message = "User wallet not found." });

            // Transfer money
            adminWallet.Balance -= transaction.Amount;
            userWallet.Balance += transaction.Amount;

            _context.UserWallets.UpdateRange(adminWallet, userWallet);

            var transfer = new AdminToUserTransaction
            {
                AdminId = CurrentUserId,
                UserId = transaction.UserId,
                Amount = transaction.Amount,
                Reason = transaction.Reason,
                Date_of_transfer = transaction.Date_of_transfer,
                CreatedAT = DateTime.Now
            };

            _context.AdminToUserTransactions.Add(transfer);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "✅ Money transferred successfully!",
                transaction = new
                {
                    transfer.TransactionId,
                    transfer.AdminId,
                    transfer.UserId,
                    transfer.Amount,
                    transfer.Reason,
                    transfer.Date_of_transfer
                },
                updated_balances = new
                {
                    AdminBalance = adminWallet.Balance,
                    UserBalance = userWallet.Balance
                }
            });
        }

        // ✅ NEW API: Get All Users With Wallet Balance
        [HttpGet("AllUsersWithWallet")]
        public async Task<ActionResult> GetAllUsersWithWallet()
        {
            if (CurrentRole != "Admin")
                return BadRequest(new { message = "❌ Only Admin can view all users." });

            var data = await (from u in _context.Users.Where(u=> u.Role != "Admin")
                              join w in _context.UserWallets
                              on u.UserId equals w.UserId  into uw
                              from w in uw.DefaultIfEmpty()
                              select new
                              {
                                  u.UserId,
                                  u.Name,
                                  u.MobileNumber,
                                  u.FactoryName,
                                  u.Role,
                                  WalletBalance = w != null ? w.Balance : 0,
                                  WalletUpdated = w.CreatedAT
                              }).ToListAsync();

            return Ok(new
            {
                message = "✅ All users with wallet balances fetched successfully.",
                count = data.Count,
                users = data
            });
        }
    }
}
