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



        // ✅ GET - Admin => all, User => only own
        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<AdvanceTransaction>>> GetAllAdvancebyid(int id)
        {
            var data = await _context.AdvanceTransactions.Where(t => t.EmployeeId == id).ToListAsync();

            if (data == null)
            {
                return BadRequest("employee not found");
            }

            return Ok(data);
        }




        // ✅ POST - Send Advance (Only User allowed)
        [HttpPost]
        public async Task<ActionResult<AdvanceTransaction>> SendAdvance([FromBody] AdvanceTransactionDTO transaction)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot send advances");

            if (transaction.payment_catagaory == "debit") {
                // ✅ Check Wallets only for current user
                var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == CurrentUserId);
                if (userWallet == null) return BadRequest("User wallet not found");

                if (userWallet.Balance < transaction.Amount)
                    return BadRequest("Insufficient balance in User wallet");

                var employeeWallet = await _context.EmployeeWallets
                    .FirstOrDefaultAsync(w => w.EmployeeId == transaction.EmployeeId);
                if (employeeWallet == null)
                    return BadRequest("Employee wallet not found or does not belong to this user");

                // ✅ Deduct & Add
                userWallet.Balance -= transaction.Amount;
                employeeWallet.AdvanceBalance += transaction.Amount;
                _context.UserWallets.Update(userWallet);
                _context.EmployeeWallets.Update(employeeWallet);
            }
            else
            {
                var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == CurrentUserId);
                if (userWallet == null) return BadRequest("User wallet not found");


                var employeeWallet = await _context.EmployeeWallets
                    .FirstOrDefaultAsync(w => w.EmployeeId == transaction.EmployeeId);
                if (employeeWallet == null)
                    return BadRequest("Employee wallet not found or does not belong to this user");

                if (employeeWallet.AdvanceBalance < transaction.Amount)
                    return BadRequest("Insufficient balance in Employee wallet");

                // ✅ Deduct & Add
                employeeWallet.AdvanceBalance -= transaction.Amount;
                userWallet.Balance += transaction.Amount;

                _context.UserWallets.Update(userWallet);
                _context.EmployeeWallets.Update(employeeWallet);
            }

                    var newTransaction = new AdvanceTransaction
                    {
                        EmployeeId = transaction.EmployeeId,
                        UserId = CurrentUserId,
                        Reason = transaction.Reason,
                        PaymentMode = transaction.PaymentMode,
                        payment_catagaory = transaction.payment_catagaory,
                        Amount = transaction.Amount,
                        Date = transaction.Date,
                        CreatedAT = DateTime.Now
                    };

                _context.AdvanceTransactions.Add(newTransaction);
          

            await _context.SaveChangesAsync();

                return Ok(new { message = "Advance sent successfully", newTransaction });
            
        }
 
    }
}
