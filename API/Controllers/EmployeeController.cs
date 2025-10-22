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
    public class EmployeeController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public EmployeeController(FEMS_DbContext context)
        {
            _context = context;
        }

        private int CurrentUserId =>
            int.Parse(User.FindFirst("userId")?.Value ??
                      throw new UnauthorizedAccessException("UserId claim missing"));
        private string CurrentfactoryName =>
                 (User.FindFirst("factoryName")?.Value ??
                      throw new UnauthorizedAccessException("factoryName claim missing"));

        private string CurrentRole =>
            User.FindFirst(ClaimTypes.Role)?.Value ?? "";

        // ✅ GET: All Employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeWithWalletDTO>>> GetEmployees()
        {
            IQueryable<Employee> query = _context.Employees;

            if (CurrentRole != "Admin")
                query = query.Where(e => e.UserId == CurrentUserId);

            var employees = await query
            .Select(e => new EmployeeWithWalletDTO
            {
                EmployeeId = e.EmployeeId,
                Name = e.Name ?? "",
                Address = e.Address ?? "",
                Village = e.Village ?? "",
                Taluka = e.Taluka ?? "",
                District = e.District ?? "",
                State = e.State ?? "",
                Role = e.Role ?? "",
                Aadhaar = e.Aadhaar ?? "",
                PanCard = e.PanCard ?? "",
                Mobile1 = e.Mobile1 ?? "",
                Mobile2 = e.Mobile2 ?? "",
                MonthlySalary = e.MonthlySalary,
                FactoryName = e.FactoryName ?? "",
                ImagePath = e.ImagePath ?? "",
                AdvanceBalance = _context.EmployeeWallets
                    .Where(w => w.EmployeeId == e.EmployeeId)
                    .Select(w => w.AdvanceBalance)
                    .FirstOrDefault()
            })
            .ToListAsync();
            return Ok(employees);
        }

        // ✅ GET: Employee By Id
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            if (CurrentRole != "Admin" && employee.UserId != CurrentUserId)
                return Forbid();

            return Ok(new
            {
                employee.EmployeeId,
                employee.Name,
                employee.Address,
                employee.Village,
                employee.Taluka,
                employee.District,
                employee.State,
                employee.Role,
                employee.Aadhaar,
                employee.PanCard,
                employee.Mobile1,
                employee.Mobile2,
                employee.MonthlySalary,
                employee.FactoryName,
                employee.ImagePath
            });
        }

        // ✅ POST: Add Employee (Only User can add)
        [HttpPost]
        public async Task<ActionResult<Employee>> AddEmployee([FromForm] EmployeeDto employee)
        {
            if (CurrentRole == "Admin")
                return BadRequest("Admin cannot add employees");

            var existingByAadhaar = await _context.Employees
                .FirstOrDefaultAsync(e => e.Aadhaar == employee.Aadhaar);
            if (existingByAadhaar != null)
                return Conflict(new { message = "Employee with this Aadhaar already exists." });

            string imagePath = null;
            if (employee.Image != null)
            {
                var fileName = $"{Guid.NewGuid()}_{employee.Image.FileName}";
                var filePath = Path.Combine("wwwroot/employee_images", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await employee.Image.CopyToAsync(stream);
                }
                imagePath = "/employee_images/" + fileName;
            }

            var employees = new Employee
            {
                Name = employee.Name,
                Address = employee.Address,
                Village = employee.Village,
                Taluka = employee.Taluka,
                District = employee.District,
                State = employee.State,
                Role = employee.Role,
                Aadhaar = employee.Aadhaar,
                PanCard = employee.PanCard,
                Mobile1 = employee.Mobile1,
                Mobile2 = employee.Mobile2,
                MonthlySalary = employee.MonthlySalary,
                UserId = CurrentUserId,
                FactoryName = CurrentfactoryName,
                ImagePath = imagePath
            };

            _context.Employees.Add(employees);
            await _context.SaveChangesAsync();

            var wallet = new EmployeeWallet
            {
                EmployeeId = employees.EmployeeId,
                AdvanceBalance = 0
            };

            _context.EmployeeWallets.Add(wallet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employees.EmployeeId }, employees);
        }

        // ✅ PUT: Update Employee
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromForm] EmployeeEditDTO employee)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot update employees");

            if (id != employee.EmployeeId)
                return BadRequest("Employee ID does not match.");

            var existingEmployee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
            if (existingEmployee == null)
                return NotFound("Employee not found");

            if (existingEmployee.UserId != CurrentUserId)
                return Forbid("This employee does not belong to the logged-in user.");

            var existingByAadhaar = await _context.Employees
                .FirstOrDefaultAsync(e => e.Aadhaar == employee.Aadhaar && e.EmployeeId != id);
            if (existingByAadhaar != null)
                return Conflict(new { message = "Another employee with this Aadhaar already exists." });

            existingEmployee.Name = employee.Name;
            existingEmployee.Address = employee.Address ?? "";
            existingEmployee.Village = employee.Village ?? "";
            existingEmployee.Taluka = employee.Taluka ?? "";
            existingEmployee.District = employee.District ?? "";
            existingEmployee.State = employee.State ?? "";
            existingEmployee.Role = employee.Role;
            existingEmployee.Aadhaar = employee.Aadhaar;
            existingEmployee.PanCard = employee.PanCard ?? "";
            existingEmployee.Mobile1 = employee.Mobile1;
            existingEmployee.Mobile2 = employee.Mobile2 ?? "";
            existingEmployee.MonthlySalary = employee.MonthlySalary;
            existingEmployee.UserId = CurrentUserId;
            existingEmployee.FactoryName = CurrentfactoryName;

            if (employee.Image != null)
            {
                var fileName = $"{Guid.NewGuid()}_{employee.Image.FileName}";
                var filePath = Path.Combine("wwwroot/employee_images", fileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath));
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await employee.Image.CopyToAsync(stream);
                }
                existingEmployee.ImagePath = "/employee_images/" + fileName;
            }

            _context.Employees.Update(existingEmployee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee updated successfully." });
        }

        // ✅ DELETE: Only User can delete his own employee
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot delete employees");

            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.EmployeeId == id);
            if (employee == null)
                return NotFound();

            if (employee.UserId != CurrentUserId)
                return Forbid();

            var wallet = await _context.EmployeeWallets
                .FirstOrDefaultAsync(w => w.EmployeeId == id);
            if (wallet != null)
                _context.EmployeeWallets.Remove(wallet);

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully." });
        }

        // ✅ GET: Wallets
        [HttpGet("employee_wallete")]
        public async Task<ActionResult<IEnumerable<EmployeeWallet>>> getemployeewalletes()
        {
            if (CurrentRole == "Admin")
                return Forbid("admin not view employee details.");

            var employeewallete = await _context.EmployeeWallets.ToListAsync();

            if (employeewallete == null) return NotFound();
            return employeewallete;
        }
    }
}
