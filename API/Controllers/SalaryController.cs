using FEMS_API.Database;
using FEMS_API.Models;
using FEMS_API.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // ✅ Token Required
    public class SalaryController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public SalaryController(FEMS_DbContext context)
        {
            _context = context;
        }

        // ✅ Helper Properties
        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException("UserId claim missing in token."));

        private string CurrentUserRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? throw new UnauthorizedAccessException("Role claim missing in token.");

        // 1️⃣ Get All Salary Transactions (Admin = All, User = Own)
        [HttpGet("GetAllSalaryTransactions")]
        public async Task<IActionResult> GetAllSalaryTransaction()
        {
            if (CurrentUserRole == "Admin")
            {
                var allSalary = await _context.SalaryTransactions.ToListAsync();
                if (!allSalary.Any())
                    return NotFound("No salary transactions found in the system.");
                return Ok(allSalary);
            }
            else
            {
                var mySalary = await _context.SalaryTransactions
                    .Where(s => s.UserId == CurrentUserId)
                    .ToListAsync();

                if (!mySalary.Any())
                    return NotFound("You have no salary transactions yet.");

                return Ok(mySalary);
            }
        }

        // 2️⃣ Generate Salary (Admin ❌ not allowed, User ✅ allowed for own employees)
        [HttpPost("GenerateSalary")]
        public async Task<IActionResult> GenerateSalary(int employeeId, DateTime startDate, DateTime endDate)
        {
            if (CurrentUserRole == "Admin")
                return Forbid("Admins are not allowed to generate salary.");

            if (endDate < startDate)
                return BadRequest("End date must be greater than or equal to start date.");

            // ✅ Proper Overlap Check (only current user's employees)
            bool alreadyProcessed = await _context.SalaryTransactions
                .AnyAsync(s => s.EmployeeId == employeeId &&
                               s.UserId == CurrentUserId &&
                               s.StartDate <= endDate &&
                               s.EndDate >= startDate);

            if (alreadyProcessed)
                return Conflict("Salary already processed for this employee for overlapping date range.");

            // 2️⃣ Employee Fetch (must belong to current user)
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeId == employeeId && e.UserId == CurrentUserId);

            if (employee == null)
                return Forbid("You are not allowed to generate salary for this employee.");

            // 3️⃣ Attendance Fetch
            var attendances = await _context.Attendances
                .Where(a => a.EmployeeId == employeeId &&
                            a.UserId == CurrentUserId &&
                            a.Date >= startDate &&
                            a.Date <= endDate)
                .ToListAsync();

            if (!attendances.Any())
                return BadRequest("No attendance records found in the selected date range.");

            // ✅ Enum-based Counts
            int presentDays = attendances.Count(a => a.Status == AttendanceStatus.Present);
            int absentDays = attendances.Count(a => a.Status == AttendanceStatus.Absent);
            int halfDays = attendances.Count(a => a.Status == AttendanceStatus.HalfDay);

            decimal perDaySalary = employee.MonthlySalary / 30;
            decimal totalSalary = (presentDays * perDaySalary) + (halfDays * (perDaySalary / 2));

            // ✅ Wallet Checks
            var employeeWallet = await _context.EmployeeWallets
                .FirstOrDefaultAsync(w => w.EmployeeId == employeeId);
            var userWallet = await _context.UserWallets
                .FirstOrDefaultAsync(w => w.UserId == CurrentUserId);

            if (employeeWallet == null)
                return BadRequest("Employee wallet not found.");
            if (userWallet == null)
                return BadRequest("User wallet not found.");

            decimal advanceBalance = employeeWallet.AdvanceBalance;
            decimal finalSalary = 0;

            if (totalSalary <= advanceBalance)
            {
                employeeWallet.AdvanceBalance -= totalSalary;
                finalSalary = 0;
            }
            else
            {
                decimal remainingSalary = totalSalary - advanceBalance;

                if (userWallet.Balance < remainingSalary)
                    return BadRequest("Insufficient balance in user wallet. Salary cannot be processed.");

                userWallet.Balance -= remainingSalary;
                employeeWallet.AdvanceBalance = 0;
                finalSalary = remainingSalary;
            }

            _context.EmployeeWallets.Update(employeeWallet);
            _context.UserWallets.Update(userWallet);

            var salaryTransaction = new SalaryTransaction
            {
                EmployeeId = employeeId,
                UserId = CurrentUserId,
                StartDate = startDate,
                EndDate = endDate,
                Month = $"{endDate:MM}",
                PresentDays = presentDays,
                AbsentDays = absentDays,
                HalfDays = halfDays,
                TotalSalary = totalSalary,
                AdvanceDeducted = advanceBalance,
                FinalSalary = finalSalary,
                Date = DateTime.Now
            };

            _context.SalaryTransactions.Add(salaryTransaction);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "✅ Salary processed successfully.",
                SalaryPeriod = $"{startDate:dd-MMM-yyyy} to {endDate:dd-MMM-yyyy}",
                PresentDays = presentDays,
                AbsentDays = absentDays,
                HalfDays = halfDays,
                TotalSalaryCalculated = totalSalary,
                AdvanceDeducted = advanceBalance,
                FinalSalaryPaid = finalSalary,
                RemainingAdvance = employeeWallet.AdvanceBalance,
                RemainingUserWalletBalance = userWallet.Balance,
                SalaryTransaction = salaryTransaction
            });
        }
    }
}
