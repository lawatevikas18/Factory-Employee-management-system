using Auth.Api.Models;
using Auth.Api.Models.employee;
using Auth.Api.Models.reports;
using Auth.Api.Repositories;
using Auth.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace Auth.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;

    public AuthController(IAuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        try
        {
            var userId = await _service.RegisterAsync(request);
            return Ok(new { userId });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        try
        {
            var result = await _service.LoginAsync(request);
            return Ok(ResponseHelper.Success(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // JWT logout is handled client-side (delete token from storage)
        return Ok(new { message = "Logged out" });
    }

    [HttpPost("getEmployeeList")]
    public async Task<IActionResult> getEmployeeList(getEmployeeListRequest request)
    {
        try
        {
            var result = await _service.getEmployeeListAsync(request);
            return Ok(ResponseHelper.Success(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }

    [HttpPost("registoreEmployee")]
    public async Task<IActionResult> registoreEmployee(RegistoreEmployeeRequest request)
    {
        try
        {
            var result = await _service.registoreEmployeeAsync(request);
            return Ok(ResponseHelper.Success(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }

    [HttpPost("saveAttendance")]
    public async Task<IActionResult> SaveAttendance([FromBody] AttendanceRequest request)
    {
        try
        {
            var result = await _service.SaveAttendanceAsync(request);
            return Ok(ResponseHelper.Success(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }
    [HttpPost("attendanceReport")]
    public async Task<IActionResult> GetAttendanceReport([FromBody] AttendanceReportRequest request)
    {
        try
        {
            var result = await _service.GetAttendanceReportAsync(request);

            return Ok(ResponseHelper.Success(result));
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }

    [HttpPost("attendanceReport/pdf")]
    public async Task<IActionResult> GetAttendanceReportPdf([FromBody] AttendanceReportRequest request)
    {
        try
        {
            var data = await _service.GetAttendanceReportAsync(request);

            // 🔹 Generate PDF with QuestPDF
            var pdf = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Margin(30);
                    var logoPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "logo.png");
                    // Header with Logo
                    page.Header().Row(row =>
                    {
                        row.ConstantItem(60).Image(logoPath);
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text("Shri Vitthal Co-op Sugar Factory Ltd.").SemiBold().FontSize(16).AlignCenter();
                            col.Item().Text("Venunagar - Gursale, Tal. Pandharpur, Dist. Solapur").FontSize(10).AlignCenter();
                            col.Item().Text($"Attendance Report ({request.FromDate:dd-MMM-yyyy} to {request.ToDate:dd-MMM-yyyy})").FontSize(12).AlignCenter();
                        });
                    });

                    // Attendance Table
                    page.Content().Table(table =>
                    {
                        table.ColumnsDefinition(columns =>
                        {
                            columns.ConstantColumn(50);
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                            columns.RelativeColumn();
                        });

                        table.Header(header =>
                        {
                            header.Cell().Text("Sr.No");
                            header.Cell().Text("Code");
                            header.Cell().Text("Name");
                            header.Cell().Text("Designation");
                            header.Cell().Text("Status");
                        });

                        int i = 1;
                        foreach (var emp in data)
                        {
                            table.Cell().Text(i++.ToString());
                            table.Cell().Text(emp.EmployeeCode);
                            table.Cell().Text(emp.EmployeeName);
                            table.Cell().Text(emp.Designation);
                            table.Cell().Text(string.IsNullOrEmpty(emp.Status) ? "-" : emp.Status);
                        }
                    });

                    // Footer with Signatures
                    page.Footer().Row(row =>
                    {
                        row.RelativeItem().AlignLeft().Text($"Prepared By: HR Department");
                        row.RelativeItem().AlignRight().Text($"Approved By: Factory Manager");
                    });
                });
            });

            var pdfBytes = pdf.GeneratePdf();
            return File(pdfBytes, "application/pdf", "AttendanceReport.pdf");
        }
        catch (Exception ex)
        {
            return BadRequest(ResponseHelper.Fail<object>(ex.Message, 401));
        }
    }

}
