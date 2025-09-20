using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class FactoryBillController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public FactoryBillController(FEMS_DbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ??
                      throw new UnauthorizedAccessException("UserId claim missing"));

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // 1️⃣ Get All Bills - Admin => All, User => Only Own
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FactoryBill>>> GetAll()
        {
            IQueryable<FactoryBill> query = _context.FactoryBills;

            if (CurrentRole != "Admin")
                query = query.Where(b => b.UserId == CurrentUserId);

            return Ok(await query.ToListAsync());
        }

        // 2️⃣ Get Bill By Id
        [HttpGet("{id}")]
        public async Task<ActionResult<FactoryBill>> GetById(int id)
        {
            var bill = await _context.FactoryBills.FindAsync(id);
            if (bill == null)
                return NotFound("Factory Bill not found.");

            if (CurrentRole != "Admin" && bill.UserId != CurrentUserId)
                return Forbid();

            return bill;
        }

        // 3️⃣ Get Bills By FactoryName - Admin can filter, User only own
        [HttpGet("ByFactory/{factoryName}")]
        public async Task<ActionResult<IEnumerable<FactoryBill>>> GetByFactory(string factoryName)
        {
            IQueryable<FactoryBill> query = _context.FactoryBills
                .Where(b => b.FactoryName.ToLower() == factoryName.ToLower());

            if (CurrentRole != "Admin")
                query = query.Where(b => b.UserId == CurrentUserId);

            var bills = await query.ToListAsync();
            if (!bills.Any())
                return NotFound($"No bills found for FactoryName: {factoryName}");

            return bills;
        }

        // 4️⃣ Create Bill (Only User can create)
        [HttpPost]
        public async Task<ActionResult<FactoryBill>> Create([FromBody] FactoryBill bill)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot create bills.");

            bill.UserId = CurrentUserId; // Force assign
            bill.CreatedDate = DateTime.Now;
            bill.PendingAmount = bill.TotalBill - bill.PaidAmount;

            _context.FactoryBills.Add(bill);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = bill.BillId }, bill);
        }

        // 5️⃣ Update Bill (Only User can update own)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] FactoryBill updatedBill)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot update bills.");

            if (id != updatedBill.BillId)
                return BadRequest("BillId mismatch.");

            var existingBill = await _context.FactoryBills.FindAsync(id);
            if (existingBill == null)
                return NotFound("Factory Bill not found.");

            if (existingBill.UserId != CurrentUserId)
                return Forbid();

            // Update fields
            existingBill.FactoryName = updatedBill.FactoryName;
            existingBill.FromDate = updatedBill.FromDate;
            existingBill.ToDate = updatedBill.ToDate;
            existingBill.WorkDescription = updatedBill.WorkDescription;
            existingBill.TotalBill = updatedBill.TotalBill;
            existingBill.PaidAmount = updatedBill.PaidAmount;
            existingBill.PendingAmount = existingBill.TotalBill - existingBill.PaidAmount;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Factory Bill updated successfully." });
        }

        // 6️⃣ Delete Bill (Only User can delete own)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot delete bills.");

            var bill = await _context.FactoryBills.FindAsync(id);
            if (bill == null)
                return NotFound("Factory Bill not found.");

            if (bill.UserId != CurrentUserId)
                return Forbid();

            _context.FactoryBills.Remove(bill);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Factory Bill deleted successfully." });
        }
    }
}
