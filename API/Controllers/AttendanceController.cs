using FEMS_API.Database;
using FEMS_API.DTOS;
using FEMS_API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using iTextSharp.text;
using iTextSharp.text.pdf;
using System.IO;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public AttendanceController(FEMS_DbContext context)
        {
            _context = context;
        }

        // ✅ Current user details
        private int CurrentUserId => int.Parse(User.FindFirst("userId")?.Value ?? throw new UnauthorizedAccessException("UserId claim missing."));
        private string CurrentRole => User.FindFirst(ClaimTypes.Role)?.Value ?? "";
        private string CurrentUser => User.FindFirst(ClaimTypes.Name)?.Value ?? "";

        #region Helper Methods

        private async Task<Attendance?> MapAndValidateAttendanceAsync(AttendanceDTO dto)
        {
            return new Attendance
            {
                EmployeeId = dto.EmployeeId,
                UserId = CurrentUserId,
                Status = dto.Status.Trim(),
                Date = dto.Date,
                OT = dto.OT,
                createdAT = DateTime.Now
            };
        }

        private Font HeaderFont => FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 16, BaseColor.Black);
        private Font TableHeaderFont => FontFactory.GetFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.White);
        private Font TableCellFont => FontFactory.GetFont(FontFactory.HELVETICA, 10, BaseColor.Black);

        private PdfPCell MakeCell(string text, Font font, BaseColor? bg = null, int align = Element.ALIGN_LEFT)
        {
            var cell = new PdfPCell(new Phrase(text ?? "—", font))
            {
                BackgroundColor = bg ?? BaseColor.White,
                HorizontalAlignment = align,
                Padding = 5
            };
            return cell;
        }

        #endregion

        #region GET - Attendance

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances(
            [FromQuery] int? employeeId,
            [FromQuery] DateTime? fromDate,
            [FromQuery] DateTime? toDate)
        {
            IQueryable<Attendance> query = _context.Attendances;

            if (CurrentRole != "Admin")
                query = query.Where(e => e.UserId == CurrentUserId);

            if (employeeId.HasValue)
                query = query.Where(a => a.EmployeeId == employeeId.Value);

            if (fromDate.HasValue)
                query = query.Where(a => a.Date.Date >= fromDate.Value.Date);
            if (toDate.HasValue)
                query = query.Where(a => a.Date.Date <= toDate.Value.Date);

            var attendances = await query.OrderByDescending(a => a.Date).ToListAsync();

            return attendances.Count == 0
                ? NotFound("No attendance records found for given filter.")
                : Ok(attendances);
        }

        #endregion

        #region GET - Download PDF Report

        [HttpGet("downloadPdf")]
        public async Task<IActionResult> DownloadPdf([FromQuery] int? employeeId, [FromQuery] DateTime? fromDate, [FromQuery] DateTime? toDate)
        {
            IQueryable<Attendance> query = _context.Attendances;

            if (CurrentRole != "Admin")
                query = query.Where(a => a.UserId == CurrentUserId);

            if (fromDate.HasValue && toDate.HasValue)
                query = query.Where(a => a.Date >= fromDate.Value.Date && a.Date <= toDate.Value.Date);

            using var ms = new MemoryStream();
            var doc = new Document(PageSize.A4, 36, 36, 36, 36);
            PdfWriter.GetInstance(doc, ms);
            doc.Open();

            // ✅ Report Header
            doc.Add(new Paragraph("Employee Attendance Report", HeaderFont) { Alignment = Element.ALIGN_CENTER });
            doc.Add(new Paragraph($"Generated On: {DateTime.Now:dd-MMM-yyyy hh:mm tt}") { Alignment = Element.ALIGN_RIGHT });
            doc.Add(new Paragraph(" "));

            // ✅ Add table depending on EmployeeId
            if (employeeId.HasValue)
            {
                var data = await (from a in query
                                  join e in _context.Employees on a.EmployeeId equals e.EmployeeId
                                  where a.EmployeeId == employeeId.Value
                                  orderby a.Date
                                  select new
                                  {
                                      e.Name,
                                      a.Date,
                                      a.Status,
                                      a.OT
                                  }).ToListAsync();

                if (!data.Any())
                    return NotFound("No records found for this employee.");

                var table = new PdfPTable(4) { WidthPercentage = 100 };
                table.SetWidths(new float[] { 3, 2, 2, 2 });

                // Header Row
                var headers = new[] { "Employee Name", "Date", "Status", "OT Hours" };
                foreach (var h in headers)
                    table.AddCell(MakeCell(h, TableHeaderFont, BaseColor.DarkGray, Element.ALIGN_CENTER));

                // Data Rows
                foreach (var r in data)
                {
                    table.AddCell(MakeCell(r.Name, TableCellFont));
                    table.AddCell(MakeCell(r.Date.ToString("dd-MMM-yyyy"), TableCellFont));

                    BaseColor statusColor = r.Status switch
                    {
                        "Present" => new BaseColor(144, 238, 144),
                        "Absent" => new BaseColor(255, 182, 193),
                        "HalfDay" => new BaseColor(255, 215, 0),
                        _ => BaseColor.White
                    };
                    table.AddCell(MakeCell(r.Status, TableCellFont, statusColor, Element.ALIGN_CENTER));
                    table.AddCell(MakeCell(r.OT.ToString(), TableCellFont, null, Element.ALIGN_CENTER));
                }

                doc.Add(table);

                // ✅ Summary
                int present = data.Count(x => x.Status == "Present");
                int absent = data.Count(x => x.Status == "Absent");
                int half = data.Count(x => x.Status == "HalfDay");
                int totalOT = data.Sum(x => x.OT);

                doc.Add(new Paragraph("\nSummary", HeaderFont));
                doc.Add(new Paragraph($"Total Present Days: {present}"));
                doc.Add(new Paragraph($"Total Absent Days: {absent}"));
                doc.Add(new Paragraph($"Total Half Days: {half}"));
                doc.Add(new Paragraph($"Total OT Hours: {totalOT}"));
            }
            else
            {
                var data = await (from a in query
                                  join e in _context.Employees on a.EmployeeId equals e.EmployeeId
                                  group new { a, e } by e.Name into g
                                  select new
                                  {
                                      Name = g.Key,
                                      Present = g.Count(x => x.a.Status == "Present"),
                                      Absent = g.Count(x => x.a.Status == "Absent"),
                                      Half = g.Count(x => x.a.Status == "HalfDay"),
                                      OT = g.Sum(x => x.a.OT)
                                  }).ToListAsync();

                if (!data.Any())
                    return NotFound("No attendance records found.");

                var table = new PdfPTable(5) { WidthPercentage = 100 };
                table.SetWidths(new float[] { 3, 2, 2, 2, 2 });

                var headers = new[] { "Employee Name", "Present Days", "Absent Days", "Half Days", "Total OT" };
                foreach (var h in headers)
                    table.AddCell(MakeCell(h, TableHeaderFont, BaseColor.DarkGray, Element.ALIGN_CENTER));

                foreach (var r in data)
                {
                    table.AddCell(MakeCell(r.Name, TableCellFont));
                    table.AddCell(MakeCell(r.Present.ToString(), TableCellFont, null, Element.ALIGN_CENTER));
                    table.AddCell(MakeCell(r.Absent.ToString(), TableCellFont, null, Element.ALIGN_CENTER));
                    table.AddCell(MakeCell(r.Half.ToString(), TableCellFont, null, Element.ALIGN_CENTER));
                    table.AddCell(MakeCell(r.OT.ToString(), TableCellFont, null, Element.ALIGN_CENTER));
                }

                doc.Add(table);
            }

            doc.Close();
            return File(ms.ToArray(), "application/pdf", "Attendance_Report.pdf");
        }

        #endregion

        #region CRUD Operations

        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var attendance = await _context.Attendances.FirstOrDefaultAsync(a => a.AttendanceId == id);
            if (attendance == null) return NotFound($"No attendance found with Id: {id}");
            if (CurrentRole != "Admin" && attendance.UserId != CurrentUserId) return Forbid();
            return Ok(attendance);
        }

        [HttpPost("Add")]
        public async Task<ActionResult> AddOrBulkAttendance([FromBody] List<AttendanceDTO> attendances)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (CurrentRole == "Admin") return Forbid("Admins cannot add attendance.");
            if (attendances == null || attendances.Count == 0) return BadRequest("No data provided.");

            var valid = new List<Attendance>();
            foreach (var dto in attendances)
            {
                var mapped = await MapAndValidateAttendanceAsync(dto);
                if (mapped != null) valid.Add(mapped);
            }

            foreach (var a in valid)
            {
                var existing = await _context.Attendances.FirstOrDefaultAsync(x => x.EmployeeId == a.EmployeeId && x.Date == a.Date);

                if (existing != null)
                {
                    if (a.Status == "NotMarked") _context.Attendances.Remove(existing);
                    else
                    {
                        existing.Status = a.Status;
                        existing.OT = a.OT;
                        existing.createdAT = DateTime.Now;
                    }
                }
                else if (a.Status != "NotMarked")
                    await _context.Attendances.AddAsync(a);
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = $"✅ {valid.Count} record(s) processed successfully.",
                processed = valid.Select(x => new { x.EmployeeId, x.Status, x.Date, x.OT })
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] Attendance attendance)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            if (CurrentRole == "Admin") return Forbid("Admins cannot update attendance.");
            if (id != attendance.AttendanceId) return BadRequest("Id mismatch.");

            var existing = await _context.Attendances.FindAsync(id);
            if (existing == null) return NotFound();

            if (existing.UserId != CurrentUserId) return Forbid();

            existing.Status = attendance.Status.Trim();
            existing.OT = attendance.OT;
            existing.Date = attendance.Date.Date;
            existing.createdAT = DateTime.Now;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Attendance updated successfully." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            if (CurrentRole == "Admin") return Forbid();
            var record = await _context.Attendances.FirstOrDefaultAsync(a => a.AttendanceId == id);
            if (record == null) return NotFound();
            if (record.UserId != CurrentUserId) return Forbid();

            _context.Attendances.Remove(record);
            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Attendance deleted successfully." });
        }

        #endregion

        #region Status By Date

        [HttpGet("StatusByDate")]
        public async Task<ActionResult<IEnumerable<object>>> GetEmployeeStatusByDate([FromQuery] DateTime? date)
        {
            var selectedDate = date?.Date ?? DateTime.Today;
            int userId = CurrentUserId;

            var query = from e in _context.Employees
                        join a in _context.Attendances.Where(x => x.Date.Date == selectedDate)
                        on e.EmployeeId equals a.EmployeeId into ea
                        from att in ea.DefaultIfEmpty()
                        select new
                        {
                            e.ImagePath,
                            e.EmployeeId,
                            e.Name,
                            selectedDate,
                            e.Role,
                            Status = att != null ? att.Status : "NotMarked",
                            OT = att != null ? att.OT : 0
                        };

            if (CurrentRole != "Admin")
                query = query.Where(x => x.EmployeeId != 0 && _context.Employees.Any(e => e.UserId == userId && e.EmployeeId == x.EmployeeId));

            return Ok(await query.ToListAsync());
        }

        #endregion
    }
}
