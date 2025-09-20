using FEMS_API.Database;
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
    public class EmployeeAdvancesController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public EmployeeAdvancesController(FEMS_DbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ??
                      throw new UnauthorizedAccessException("UserId claim missing"));

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // ✅ GET - Admin => all, User => only own
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AdvanceTransaction>>> GetAllAdvanceTransactions()
        {
            IQueryable<AdvanceTransaction> query = _context.AdvanceTransactions;

            if (CurrentRole != "Admin")
                query = query.Where(t => t.UserId == CurrentUserId);

            return Ok(await query.ToListAsync());
        }

        // ✅ POST - Send Advance (Only User allowed)
        [HttpPost]
        public async Task<ActionResult<AdvanceTransaction>> SendAdvance([FromBody] AdvanceTransaction transaction)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot send advances");
            if (transaction.UserId == CurrentUserId)
            {
                // 🔒 UserId force करतो (token मधून)
                transaction.UserId = CurrentUserId;

                // ✅ Check Wallets only for current user
                var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == transaction.UserId);
                if (userWallet == null) return BadRequest("User wallet not found");

                if (userWallet.Balance < transaction.Amount)
                    return BadRequest("Insufficient balance in User wallet");

                var employeeWallet = await _context.EmployeeWallets
                    .FirstOrDefaultAsync(w => w.EmployeeId == transaction.EmployeeId );
                if (employeeWallet == null)
                    return BadRequest("Employee wallet not found or does not belong to this user");

                // ✅ Deduct & Add
                userWallet.Balance -= transaction.Amount;
                employeeWallet.AdvanceBalance += transaction.Amount;

                _context.UserWallets.Update(userWallet);
                _context.EmployeeWallets.Update(employeeWallet);

                transaction.Date = DateTime.Now;
                _context.AdvanceTransactions.Add(transaction);

                await _context.SaveChangesAsync();

                return Ok(new { message = "Advance sent successfully", transaction });
            }
            else
            {
                return BadRequest();
            }
        }

        //// ✅ (Optional) DELETE - Allow only user to delete his own advance transaction
        //[HttpDelete("{id}")]
        //public async Task<IActionResult> DeleteAdvance(int id)
        //{
        //    if (CurrentRole == "Admin")
        //        return Forbid("Admin cannot delete advances");

        //    var transaction = await _context.AdvanceTransactions.FirstOrDefaultAsync(t => t.Id == id);
        //    if (transaction == null)
        //        return NotFound();

        //    if (transaction.UserId != CurrentUserId)
        //        return Forbid();

        //    _context.AdvanceTransactions.Remove(transaction);
        //    await _context.SaveChangesAsync();

        //    return Ok(new { message = "Advance transaction deleted successfully" });
        //}
    }
}
