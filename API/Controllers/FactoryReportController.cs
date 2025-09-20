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
    [Authorize] // ✅ Token Required
    public class FactoryReportController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public FactoryReportController(FEMS_DbContext context)
        {
            _context = context;
        }

        // ✅ Helper Properties
        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException("UserId claim missing"));

        private string CurrentUserRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? throw new UnauthorizedAccessException("Role claim missing");

        // 1️⃣ Get All Reports (Admin = All, User = Only Own)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FactoryReport>>> GetAll()
        {
            if (CurrentUserRole == "Admin")
            {
                // ✅ Admin can see ALL reports
                return await _context.FactoryReports.ToListAsync();
            }
            else
            {
                // ✅ User can see only own reports
                return await _context.FactoryReports
                    .Where(r => r.UserId == CurrentUserId)
                    .ToListAsync();
            }
        }

        // 2️⃣ Get Report by Id (Admin = Any, User = Own)
        [HttpGet("{id}")]
        public async Task<ActionResult<FactoryReport>> GetById(int id)
        {
            var report = await _context.FactoryReports.FindAsync(id);
            if (report == null)
                return NotFound("Factory Report not found.");

            if (CurrentUserRole != "Admin" && report.UserId != CurrentUserId)
                return Forbid("You are not allowed to view this report.");

            return report;
        }

        // 3️⃣ Create New Report (❌ Admin cannot create, ✅ User can create own)
        [HttpPost]
        public async Task<ActionResult<FactoryReport>> Create(FactoryReport report)
        {
            if (CurrentUserRole == "Admin")
                return Forbid("Admins cannot create reports.");

            report.UserId = CurrentUserId; // force assign
            _context.FactoryReports.Add(report);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = report.Id }, report);
        }

        // 4️⃣ Update Report (❌ Admin cannot update, ✅ User can update own)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, FactoryReport updatedReport)
        {
            if (CurrentUserRole == "Admin")
                return Forbid("Admins cannot update reports.");

            if (id != updatedReport.Id)
                return BadRequest("Report ID mismatch.");

            var existingReport = await _context.FactoryReports.FindAsync(id);
            if (existingReport == null)
                return NotFound("Factory Report not found.");

            if (existingReport.UserId != CurrentUserId)
                return Forbid("You cannot update this report.");

            // ✅ Update allowed fields
            existingReport.FactoryName = updatedReport.FactoryName;
            existingReport.StartDate = updatedReport.StartDate;
            existingReport.EndDate = updatedReport.EndDate;
            existingReport.SugarPacking50Kg = updatedReport.SugarPacking50Kg;
            existingReport.HamalKamgarPagar = updatedReport.HamalKamgarPagar;
            existingReport.SugarHouseSilaiKamgarPagar = updatedReport.SugarHouseSilaiKamgarPagar;
            existingReport.TotalKamgarPagar = updatedReport.TotalKamgarPagar;
            existingReport.VarniMukadamSankhya = updatedReport.VarniMukadamSankhya;
            existingReport.MukadamVarniCharge = updatedReport.MukadamVarniCharge;
            existingReport.MukadamVarniRakkam = updatedReport.MukadamVarniRakkam;
            existingReport.RackVarniMukadamSankhya = updatedReport.RackVarniMukadamSankhya;
            existingReport.RackMukadamVarniCharge = updatedReport.RackMukadamVarniCharge;
            existingReport.RackVarniTotalRakkam = updatedReport.RackVarniTotalRakkam;
            existingReport.TotalLoadingTonnage = updatedReport.TotalLoadingTonnage;
            existingReport.TonnageCharge = updatedReport.TonnageCharge;
            existingReport.TotalTonnageRakkam = updatedReport.TotalTonnageRakkam;
            existingReport.TotalAssamHamal = updatedReport.TotalAssamHamal;
            existingReport.AssamHamalCharges = updatedReport.AssamHamalCharges;
            existingReport.TotalAssamVarniRakkam = updatedReport.TotalAssamVarniRakkam;
            existingReport.FinalTotal = updatedReport.FinalTotal;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 5️⃣ Delete Report (❌ Admin cannot delete, ✅ User can delete own)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            if (CurrentUserRole == "Admin")
                return Forbid("Admins cannot delete reports.");

            var report = await _context.FactoryReports.FindAsync(id);
            if (report == null)
                return NotFound("Factory Report not found.");

            if (report.UserId != CurrentUserId)
                return Forbid("You cannot delete this report.");

            _context.FactoryReports.Remove(report);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
