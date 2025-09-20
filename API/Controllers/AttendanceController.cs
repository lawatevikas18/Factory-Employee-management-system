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
    public class AttendanceController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public AttendanceController(FEMS_DbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
           int.Parse(User.FindFirst("userId")?.Value ??
                     throw new UnauthorizedAccessException("UserId claim missing in token."));

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // ✅ Common Validation + Mapping
        private async Task<Attendance?> MapAndValidateAttendanceAsync(AttendanceDTO dto)
        {
            bool exists = await _context.Attendances
                .AnyAsync(a => a.EmployeeId == dto.EmployeeId &&
                               a.UserId == CurrentUserId &&
                               a.Date.Date == dto.Date.Date);

            if (exists) return null;

            return new Attendance
            {
                EmployeeId = dto.EmployeeId,
                UserId = CurrentUserId,
                Status = dto.Status,
                Date = dto.Date
            };
        }

        // ✅ GET All Attendance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attendance>>> GetAttendances()
        {
            IQueryable<Attendance> query = _context.Attendances;

            if (CurrentRole != "Admin")
                query = query.Where(e => e.UserId == CurrentUserId);

            var attendances = await query.ToListAsync();

            if (attendances.Count == 0)
                return NotFound("No attendance records found.");

            return Ok(attendances);
        }

        // ✅ GET Attendance by Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Attendance>> GetAttendance(int id)
        {
            var attendance = await _context.Attendances.FirstOrDefaultAsync(a => a.AttendanceId == id);

            if (attendance == null)
                return NotFound($"No attendance record found with Id: {id}");

            if (CurrentRole != "Admin" && attendance.UserId != CurrentUserId)
                return Forbid("You do not have permission to access this attendance record.");

            return Ok(attendance);
        }

        // ✅ POST - Add Single Attendance
        [HttpPost("Add")]
        public async Task<ActionResult> AddAttendance([FromBody] AttendanceDTO attendance)
        {

            Console.WriteLine(attendance);
            if (CurrentRole == "Admin")
                return Forbid("Admins are not allowed to add attendance records.");

            var entity = await MapAndValidateAttendanceAsync(attendance);
            if (entity == null)
                return Conflict("Attendance already exists for this employee on the selected date.");

            _context.Attendances.Add(entity);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Attendance added successfully." });
        }

        // ✅ POST - Add Multiple Attendance
        [HttpPost("AddBulk")]
        public async Task<ActionResult> AddBulkAttendance([FromBody] List<AttendanceDTO> attendances)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admins are not allowed to add attendance records.");

            if (attendances == null || attendances.Count == 0)
                return BadRequest("No attendance data provided. Please send at least one record.");

            var validAttendances = new List<Attendance>();

            foreach (var dto in attendances)
            {
                var entity = await MapAndValidateAttendanceAsync(dto);
                if (entity != null)
                    validAttendances.Add(entity);
            }

            if (validAttendances.Count == 0)
                return Conflict("All provided attendance records already exist. No new records added.");

            _context.Attendances.AddRange(validAttendances);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"✅ {validAttendances.Count} attendance record(s) added successfully." });
        }

        // ✅ PUT - Update Attendance
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAttendance(int id, [FromBody] Attendance attendance)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admins are not allowed to update attendance records.");

            if (id != attendance.AttendanceId)
                return BadRequest($"The route Id ({id}) does not match the attendance Id ({attendance.AttendanceId}).");

            var existing = await _context.Attendances.FirstOrDefaultAsync(a => a.AttendanceId == id);
            if (existing == null)
                return NotFound($"No attendance record found with Id: {id}");

            if (existing.UserId != CurrentUserId)
                return Forbid("You do not have permission to update this attendance record.");

            existing.Status = attendance.Status;
            existing.Date = attendance.Date;

            await _context.SaveChangesAsync();
            return Ok(new { message = "✅ Attendance updated successfully." });
        }

        // ✅ DELETE - Remove Attendance
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAttendance(int id)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admins are not allowed to delete attendance records.");

            var attendance = await _context.Attendances.FirstOrDefaultAsync(a => a.AttendanceId == id);
            if (attendance == null)
                return NotFound($"No attendance record found with Id: {id}");

            if (attendance.UserId != CurrentUserId)
                return Forbid("You do not have permission to delete this attendance record.");

            _context.Attendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return Ok(new { message = "✅ Attendance deleted successfully." });
        }

        // ✅ EXTRA: Get Today's Attendance Count
        [HttpGet("TodayCount")]
        public async Task<ActionResult> GetTodayAttendanceCount()
        {
            IQueryable<Attendance> query = _context.Attendances;

            if (CurrentRole != "Admin")
                query = query.Where(a => a.UserId == CurrentUserId);

            var today = DateTime.Today;
            int count = await query.CountAsync(a => a.Date.Date == today);

            return Ok(new
            {
                Date = today.ToString("yyyy-MM-dd"),
                TotalAttendanceToday = count,
                message = count > 0
                    ? $"✅ {count} attendance record(s) found for today."
                    : "ℹ No attendance records found for today."
            });
        }
    }
}
