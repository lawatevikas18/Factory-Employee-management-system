using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
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

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdminToUserTransaction>>> GetAllTransactions()
        {
            if (CurrentRole != "Admin")
            {
                return BadRequest("only Admin can view");
            }
            return Ok(await _context.AdminToUserTransactions.ToListAsync());

        }


        [HttpGet("AdminWallate/{adminId}")]
        public async Task<ActionResult<IEnumerable<UserWallet>>> GetUserswallate(int adminId)
        {
            if (CurrentRole != "Admin")
            {
                return BadRequest("only Admin can Do");
            }
            var adminwallate = await _context.AdminWallets.FindAsync(adminId);

            return Ok(adminwallate);
        }


        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetUserTransactionsWithBalance(int userId)
        {

            if (CurrentRole != "Admin")
            {
                return BadRequest("only Admin can Do");
            }
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
                          t.Date
                      })
                .OrderBy(t => t.Date) // order ascending for running total
                .ToListAsync();

            if (transactions.Count == 0) return NotFound("No transactions found for this user.");

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
                    t.Date,
                    RunningTotal = runningTotal
                };
            }).OrderByDescending(t => t.Date); // optional: show latest first

            return Ok(result);
        }


        [HttpPost]
        public async Task<ActionResult<AdminToUserTransaction>> SendMoney(AdminToUserTransaction transaction)
        {

            if (CurrentRole != "Admin")
            {
                return BadRequest("only Admin can Do");
            }
            // Get Admin Wallet
            var adminWallet = await _context.AdminWallets.FirstOrDefaultAsync(w => w.AdminId == transaction.AdminId);
            if (adminWallet == null) return BadRequest("Admin wallet not found");

            // Check if Admin has enough balance
            if (adminWallet.Balance < transaction.Amount)
                return BadRequest("Insufficient balance in Admin wallet");

            // Get User Wallet
            var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == transaction.UserId);
            if (userWallet == null) return BadRequest("User wallet not found");

            // Deduct from Admin
            adminWallet.Balance -= transaction.Amount;

            // Add to User
            userWallet.Balance += transaction.Amount;

            // Save Wallet Changes
            _context.AdminWallets.Update(adminWallet);
            _context.UserWallets.Update(userWallet);

            // Save Transaction Record
            transaction.Date = DateTime.Now;
            _context.AdminToUserTransactions.Add(transaction);

            await _context.SaveChangesAsync();

            return Ok(transaction);
        }

    }
}
