using FEMS_API.Database;
using FEMS_API.Models;
using FEMS_API.DTOS;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using iTextSharp.text;
using iTextSharp.text.pdf;

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
            var salaryPreviews = new List<object>();
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


        [HttpGet("PreviewAllSalary")]
        public async Task<IActionResult> PreviewAllSalary()
        {
            var today = DateTime.Today;
            var employees = new List<Employee>();

            if (CurrentUserRole != "Admin")
            {
                employees = await _context.Employees
                                .Where(e => e.UserId == CurrentUserId)
                                .ToListAsync();
            }
            else
            {
                employees = await _context.Employees
                                .ToListAsync();
            }


            if (!employees.Any())
                return NotFound("No employees found for this user.");

            var salaryPreviews = new List<object>();

            foreach (var employee in employees)
            {
                var lastSalary = await _context.SalaryTransactions
                    .Where(s => s.EmployeeId == employee.EmployeeId && s.UserId == CurrentUserId)
                    .OrderByDescending(s => s.EndDate)
                    .FirstOrDefaultAsync();

                var firstAttendance = await _context.Attendances
                    .Where(a => a.EmployeeId == employee.EmployeeId)
                    .OrderBy(a => a.Date)
                    .FirstOrDefaultAsync();

                if (firstAttendance == null)
                {
                    salaryPreviews.Add(new
                    {
                        employeeId = employee.EmployeeId,
                        employeeName = employee.Name,
                        startDate = (DateTime?)null,
                        endDate = (DateTime?)null,
                        presentDays = 0,
                        absentDays = 0,
                        halfDays = 0,
                        otHours = 0,
                        totalSalaryPreview = 0,
                        statusMessage = "⚠️ No attendance records found."
                    });
                    continue;
                }

                DateTime startDate = lastSalary != null
                    ? lastSalary.EndDate.AddDays(1)
                    : firstAttendance.Date.Date;

                if (startDate > today)
                {
                    salaryPreviews.Add(new
                    {
                        employeeId = employee.EmployeeId,
                        employeeName = employee.Name,
                        startDate = (DateTime?)null,
                        endDate = (DateTime?)null,
                        presentDays = 0,
                        absentDays = 0,
                        halfDays = 0,
                        otHours = 0,
                        totalSalaryPreview = 0,
                        statusMessage = "✅ No pending salary to calculate."
                    });
                    continue;
                }

                var attendances = await _context.Attendances
                    .Where(a => a.EmployeeId == employee.EmployeeId &&
                                a.Date.Date >= startDate &&
                                a.Date.Date <= today)
                    .ToListAsync();

                if (!attendances.Any())
                {
                    salaryPreviews.Add(new
                    {
                        employeeId = employee.EmployeeId,
                        employeeName = employee.Name,
                        startDate = (DateTime?)null,
                        endDate = (DateTime?)null,
                        presentDays = 0,
                        absentDays = 0,
                        halfDays = 0,
                        otHours = 0,
                        totalSalaryPreview = 0,
                        statusMessage = "⚠️ No attendance found for pending period."
                    });
                    continue;
                }

                int presentDays = attendances.Count(a => a.Status == "Present");
                int absentDays = attendances.Count(a => a.Status == "Absent");
                int halfDays = attendances.Count(a => a.Status == "HalfDay");
                int totalOTHours = attendances.Sum(a => a.OT);

                decimal perDaySalary = employee.MonthlySalary / 30;
                decimal perHourSalary = perDaySalary / 8;
                decimal totalSalary = (presentDays * perDaySalary)
                                    + (halfDays * (perDaySalary / 2))
                                    + (totalOTHours * perHourSalary);

                var employee_advance = await _context.EmployeeWallets.FirstOrDefaultAsync(a => a.EmployeeId == employee.EmployeeId);

                salaryPreviews.Add(new
                {
                    employeeId = employee.EmployeeId,
                    employeeName = employee.Name,
                    startDate = startDate,
                    endDate = today,
                    presentDays,
                    absentDays,
                    halfDays,
                    otHours = totalOTHours,
                    totalSalaryPreview = Math.Round(totalSalary, 2),
                    advance = employee_advance.AdvanceBalance,
                    statusMessage = "✅ Salary calculated"
                });
            }

            return Ok(salaryPreviews);
        }



        [HttpGet("DownloadSalaryReport/{employeeId}")]
        public async Task<IActionResult> DownloadSalaryReport(int employeeId)
        {
            try
            {
                var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
                var advance = await _context.EmployeeWallets.FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

                if (employee == null)
                    return NotFound("Employee not found");

                var transactions = await _context.SalaryTransactions
                    .Where(x => x.EmployeeId == employeeId)
                    .OrderByDescending(x => x.StartDate)
                    .ToListAsync();

                if (!transactions.Any())
                    return BadRequest("No salary transactions found.");

                using var ms = new MemoryStream();
                using (var doc = new iTextSharp.text.Document(PageSize.A4, 36, 36, 50, 40))
                {
                    var writer = iTextSharp.text.pdf.PdfWriter.GetInstance(doc, ms);
                    doc.Open();

                    // 🎨 Fonts
                    var titleFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.White);
                    var headerFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.White);
                    var normalFont = FontFactory.GetFont(FontFactory.HELVETICA, 10, BaseColor.Black);
                    var boldFont = FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 10, BaseColor.Black);

                    // 🟦 Header background
                    var headerTable = new iTextSharp.text.pdf.PdfPTable(1)
                    {
                        WidthPercentage = 100
                    };
                    var headerCell = new PdfPCell(new Phrase("EMPLOYEE SALARY REPORT", titleFont))
                    {
                        BackgroundColor = new BaseColor(37, 99, 235), // blue
                        Border = Rectangle.NO_BORDER,
                        HorizontalAlignment = Element.ALIGN_CENTER,
                        Padding = 10
                    };
                    headerTable.AddCell(headerCell);
                    doc.Add(headerTable);

                    // 👤 Employee Info Section
                    doc.Add(new Paragraph("\n"));
                    var infoTable = new iTextSharp.text.pdf.PdfPTable(2) { WidthPercentage = 100 };
                    infoTable.DefaultCell.Border = Rectangle.NO_BORDER;

                    infoTable.AddCell(new Phrase($"Employee Name: {employee.Name}", boldFont));
                    infoTable.AddCell(new Phrase($"Generated On: {DateTime.Now:dd-MMM-yyyy hh:mm tt}", boldFont));
                    infoTable.AddCell(new Phrase($"Monthly Salary: ₹{employee.MonthlySalary:0.00}", normalFont));

                    doc.Add(infoTable);
                    doc.Add(new Paragraph("\n"));

                    // 📊 Salary Table
                    var table = new iTextSharp.text.pdf.PdfPTable(7)
                    {
                        WidthPercentage = 100,
                        SpacingBefore = 5,
                        SpacingAfter = 10
                    };
                    table.SetWidths(new float[] { 2.5f, 0.8f, 0.8f, 0.8f, 0.8f, 1.5f, 1.5f });

                    // Add table header
                    string[] headers = { "Period", "P", "A", "H", "OT", "Advance Deducted", "Final Salary" };
                    foreach (var header in headers)
                    {
                        var cell = new PdfPCell(new Phrase(header, headerFont))
                        {
                            BackgroundColor = new BaseColor(37, 99, 235),
                            HorizontalAlignment = Element.ALIGN_CENTER,
                            Padding = 5
                        };
                        table.AddCell(cell);
                    }

                    // Add data rows
                    foreach (var t in transactions)
                    {
                        table.AddCell(new Phrase($"{t.StartDate:dd-MMM} - {t.EndDate:dd-MMM-yyyy}", normalFont));
                        table.AddCell(new Phrase(t.PresentDays.ToString(), normalFont));
                        table.AddCell(new Phrase(t.AbsentDays.ToString(), normalFont));
                        table.AddCell(new Phrase(t.HalfDays.ToString(), normalFont));
                        table.AddCell(new Phrase(t.TotalOTHours.ToString(), normalFont));
                        table.AddCell(new Phrase($"₹{t.AdvanceDeducted:0.00}", normalFont));
                        table.AddCell(new Phrase($"₹{t.FinalSalary:0.00}", boldFont));
                    }

                    doc.Add(table);

                    // 💡 Summary Footer
                    decimal totalPaid = transactions.Sum(x => x.FinalSalary);
                    decimal totalAdvance = transactions.Sum(x => x.AdvanceDeducted);

                    var summary = new PdfPTable(2)
                    {
                        WidthPercentage = 50,
                        HorizontalAlignment = Element.ALIGN_RIGHT
                    };

                    summary.AddCell(new PdfPCell(new Phrase("Total Advance Deducted:", boldFont)) { Border = Rectangle.NO_BORDER });
                    summary.AddCell(new PdfPCell(new Phrase($"₹{totalAdvance:0.00}", normalFont)) { Border = Rectangle.NO_BORDER });

                    summary.AddCell(new PdfPCell(new Phrase("Total Salary Paid:", boldFont)) { Border = Rectangle.NO_BORDER });
                    summary.AddCell(new PdfPCell(new Phrase($"₹{totalPaid:0.00}", normalFont)) { Border = Rectangle.NO_BORDER });

                    summary.AddCell(new PdfPCell(new Phrase("Final Advance Pending:", boldFont)) { Border = Rectangle.NO_BORDER });
                    summary.AddCell(new PdfPCell(new Phrase($"₹{advance.AdvanceBalance:0.00}", normalFont)) { Border = Rectangle.NO_BORDER });

                    doc.Add(summary);

                    // 🧾 Footer
                    doc.Add(new Paragraph("\n"));
                    var footer = new Paragraph("This is a system-generated report. No signature required.",
                        FontFactory.GetFont(FontFactory.HELVETICA_OBLIQUE, 9, BaseColor.Gray))
                    {
                        Alignment = Element.ALIGN_CENTER
                    };
                    doc.Add(footer);

                    doc.Close();
                }

                ms.Position = 0;
                return File(ms.ToArray(), "application/pdf", $"{employee.Name}_SalaryReport.pdf");
            }
            catch (Exception ex)
            {
                Console.WriteLine("PDF Error: " + ex.Message);
                return StatusCode(500, "PDF generation failed: " + ex.Message);
            }
        }



        //[HttpPost("GenerateSalary")]
        //public async Task<IActionResult> GenerateSalary([FromBody] GenerateSalaryDTO dto)
        //{
        //    var today = DateTime.Today.Date;

        //    if (!ModelState.IsValid)
        //        return BadRequest(ModelState);

        //    if (CurrentUserRole == "Admin")
        //        return Forbid("Admins are not allowed to generate salary.");

        //    if (dto.EndDate.Date > today)
        //        return BadRequest("End date must not be a future date.");

        //    if (dto.EndDate.Date < dto.StartDate.Date)
        //        return BadRequest("End date must be greater than or equal to start date.");

        //    // ✅ Check overlapping salary transactions
        //    bool alreadyProcessed = await _context.SalaryTransactions
        //        .AnyAsync(s => s.EmployeeId == dto.EmployeeId &&
        //                       s.UserId == CurrentUserId &&
        //                       s.StartDate.Date <= dto.EndDate.Date &&
        //                       s.EndDate.Date >= dto.StartDate.Date);

        //    if (alreadyProcessed)
        //        return Conflict("Salary already processed for this employee for overlapping date range.");

        //    // ✅ Fetch employee (must belong to current user)
        //    var employee = await _context.Employees
        //        .FirstOrDefaultAsync(e => e.EmployeeId == dto.EmployeeId && e.UserId == CurrentUserId);

        //    if (employee == null)
        //        return Forbid("You are not allowed to generate salary for this employee.");

        //    // ✅ Fetch attendance within date range
        //    var attendances = await _context.Attendances
        //        .Where(a => a.EmployeeId == dto.EmployeeId &&
        //                    a.Date.Date >= dto.StartDate.Date &&
        //                    a.Date.Date <= dto.EndDate.Date)
        //        .ToListAsync();

        //    if (!attendances.Any())
        //        return BadRequest("No attendance records found in the selected date range.");

        //    // ✅ Count Present / Absent / HalfDay
        //    int presentDays = attendances.Count(a => a.Status == "Present");
        //    int absentDays = attendances.Count(a => a.Status == "Absent");
        //    int halfDays = attendances.Count(a => a.Status == "HalfDay");

        //    // ✅ Calculate OT
        //    int totalOTHours = attendances.Sum(a => a.OT); // from attendance table

        //    // ✅ Salary calculation
        //    decimal perDaySalary = employee.MonthlySalary / 30;
        //    decimal perHourSalary = perDaySalary / 8; // Assuming 8 working hours
        //    decimal totalSalary = (presentDays * perDaySalary)
        //                        + (halfDays * (perDaySalary / 2))
        //                        + (totalOTHours * perHourSalary);

        //    // ✅ Wallet logic
        //    var employeeWallet = await _context.EmployeeWallets
        //        .FirstOrDefaultAsync(w => w.EmployeeId == dto.EmployeeId);
        //    var userWallet = await _context.UserWallets
        //        .FirstOrDefaultAsync(w => w.UserId == CurrentUserId);

        //    if (employeeWallet == null)
        //        return BadRequest("Employee wallet not found.");
        //    if (userWallet == null)
        //        return BadRequest("User wallet not found.");

        //    // ✅ Manual advance deduction logic
        //    decimal manualAdvance = dto.ManualAdvanceDeduct;
        //    if (manualAdvance < 0)
        //        return BadRequest("Advance deduction cannot be negative.");

        //    if (manualAdvance > employeeWallet.AdvanceBalance)
        //        return BadRequest("Advance deduction exceeds employee’s available advance balance.");

        //    decimal finalSalary = totalSalary - manualAdvance;
        //    if (finalSalary < 0)
        //        return BadRequest("Advance deduction exceeds employee’s Salary.");

        //    // ✅ Wallet adjustments
        //    employeeWallet.AdvanceBalance -= manualAdvance;

        //    if (userWallet.Balance < finalSalary)
        //        return BadRequest("Insufficient balance in user wallet.");

        //    userWallet.Balance -= finalSalary;

        //    _context.EmployeeWallets.Update(employeeWallet);
        //    _context.UserWallets.Update(userWallet);

        //    // ✅ Create salary transaction
        //    var salaryTransaction = new SalaryTransaction
        //    {
        //        EmployeeId = dto.EmployeeId,
        //        UserId = CurrentUserId,
        //        StartDate = dto.StartDate.Date,
        //        EndDate = dto.EndDate.Date,
        //        Month = dto.EndDate.ToString("MMMM"),
        //        PresentDays = presentDays,
        //        AbsentDays = absentDays,
        //        HalfDays = halfDays,
        //        TotalOTHours = totalOTHours,
        //        TotalSalary = totalSalary,
        //        AdvanceDeducted = manualAdvance, // ✅ Manual value
        //        FinalSalary = finalSalary,
        //        CreatedAT = DateTime.Now
        //    };

        //    _context.SalaryTransactions.Add(salaryTransaction);
        //    await _context.SaveChangesAsync();

        //    return Ok(new
        //    {
        //        Message = "✅ Salary processed successfully (manual advance deduction).",
        //        SalaryPeriod = $"{dto.StartDate:dd-MMM-yyyy} to {dto.EndDate:dd-MMM-yyyy}",
        //        PresentDays = presentDays,
        //        AbsentDays = absentDays,
        //        HalfDays = halfDays,
        //        OTHours = totalOTHours,
        //        TotalSalaryCalculated = totalSalary,
        //        ManualAdvanceDeducted = manualAdvance,
        //        FinalSalaryPaid = finalSalary,
        //        RemainingAdvance = employeeWallet.AdvanceBalance,
        //        RemainingUserWalletBalance = userWallet.Balance,
        //        SalaryTransaction = salaryTransaction
        //    });
        //}


        [HttpPost("GenerateSalary")]
        public async Task<IActionResult> GenerateSalary([FromBody] GenerateSalaryDTO dto)
        {
            try
            {
                var today = DateTime.Today;

                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                if (CurrentUserRole == "Admin")
                    return StatusCode(403, new { message = "Admins cannot generate salary." });

                if (dto.EndDate.Date > today)
                    return BadRequest(new { message = "End date cannot be a future date." });

                if (dto.EndDate.Date < dto.StartDate.Date)
                    return BadRequest(new { message = "End date must be greater than or equal to start date." });

                bool alreadyProcessed = await _context.SalaryTransactions
                    .AnyAsync(s => s.EmployeeId == dto.EmployeeId &&
                                   s.UserId == CurrentUserId &&
                                   s.StartDate.Date <= dto.EndDate.Date &&
                                   s.EndDate.Date >= dto.StartDate.Date);

                if (alreadyProcessed)
                    return Conflict(new { message = "Salary already processed for this employee for overlapping period." });

                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeId == dto.EmployeeId && e.UserId == CurrentUserId);

                if (employee == null)
                    return StatusCode(403, new { message = "You are not allowed to generate salary for this employee." });

                var attendances = await _context.Attendances
                    .Where(a => a.EmployeeId == dto.EmployeeId &&
                                a.Date.Date >= dto.StartDate.Date &&
                                a.Date.Date <= dto.EndDate.Date)
                    .ToListAsync();

                if (!attendances.Any())
                    return BadRequest(new { message = "No attendance records found for selected period." });

                int presentDays = attendances.Count(a => a.Status == "Present");
                int absentDays = attendances.Count(a => a.Status == "Absent");
                int halfDays = attendances.Count(a => a.Status == "HalfDay");
                int totalOTHours = attendances.Sum(a => a.OT);

                decimal perDaySalary = employee.MonthlySalary / 30;
                decimal perHourSalary = perDaySalary / 8;
                decimal totalSalary = (presentDays * perDaySalary)
                                    + (halfDays * (perDaySalary / 2))
                                    + (totalOTHours * perHourSalary);

                var employeeWallet = await _context.EmployeeWallets.FirstOrDefaultAsync(w => w.EmployeeId == dto.EmployeeId);
                var userWallet = await _context.UserWallets.FirstOrDefaultAsync(w => w.UserId == CurrentUserId);

                if (employeeWallet == null)
                    return BadRequest(new { message = "Employee wallet not found." });
                if (userWallet == null)
                    return BadRequest(new { message = "User wallet not found." });

                decimal manualAdvance = dto.ManualAdvanceDeduct;
                if (manualAdvance < 0)
                    return BadRequest(new { message = "Advance deduction cannot be negative." });

                if (manualAdvance > employeeWallet.AdvanceBalance)
                    return BadRequest(new { message = "Advance deduction exceeds employee’s available advance balance." });

                decimal finalSalary = totalSalary - manualAdvance;
                if (finalSalary < 0)
                    return BadRequest(new { message = "Advance deduction exceeds employee’s salary." });

                employeeWallet.AdvanceBalance -= manualAdvance;

                if (userWallet.Balance < finalSalary)
                    return BadRequest(new { message = "Insufficient balance in user wallet." });

                userWallet.Balance -= finalSalary;

                _context.EmployeeWallets.Update(employeeWallet);
                _context.UserWallets.Update(userWallet);

                var salaryTransaction = new SalaryTransaction
                {
                    EmployeeId = dto.EmployeeId,
                    UserId = CurrentUserId,
                    StartDate = dto.StartDate.Date,
                    EndDate = dto.EndDate.Date,
                    Month = dto.EndDate.ToString("MMMM"),
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    HalfDays = halfDays,
                    TotalOTHours = totalOTHours,
                    TotalSalary = totalSalary,
                    AdvanceDeducted = manualAdvance,
                    FinalSalary = finalSalary,
                    CreatedAT = DateTime.Now
                };

                _context.SalaryTransactions.Add(salaryTransaction);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "✅ Salary processed successfully.",
                    SalaryPeriod = $"{dto.StartDate:dd-MMM-yyyy} to {dto.EndDate:dd-MMM-yyyy}",
                    PresentDays = presentDays,
                    AbsentDays = absentDays,
                    HalfDays = halfDays,
                    OTHours = totalOTHours,
                    TotalSalaryCalculated = totalSalary,
                    ManualAdvanceDeducted = manualAdvance,
                    FinalSalaryPaid = finalSalary,
                    RemainingAdvance = employeeWallet.AdvanceBalance,
                    RemainingUserWalletBalance = userWallet.Balance,
                    SalaryTransaction = salaryTransaction
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("[GenerateSalary Error] " + ex);
                return StatusCode(500, new { message = "Internal server error", details = ex.Message });
            }
        }

    }
}
