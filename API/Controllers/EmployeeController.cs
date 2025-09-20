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

        // ✅ GET: Admin => All Employees, User => Only Own
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            IQueryable<Employee> query = _context.Employees;

            if (CurrentRole != "Admin")
                query = query.Where(e => e.UserId == CurrentUserId);

            return Ok(await query.ToListAsync());
        }

        // ✅ GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null)
                return NotFound();

            if (CurrentRole != "Admin" && employee.UserId != CurrentUserId)
                return Forbid();

            return employee;
        }

        // ✅ POST: Add Employee (Only User can add)
        [HttpPost]
        public async Task<ActionResult<Employee>> AddEmployee([FromBody] Employee employee)
        {
            if (CurrentRole == "Admin")
                return BadRequest("Admin cannot add employees");
            if (employee.UserId != CurrentUserId)
                return BadRequest("please add correct user id");
            if (employee.FactoryName != CurrentfactoryName)
                return BadRequest("please add correct factoryName same to superwise");

            employee.UserId = CurrentUserId; // Force UserId from token

            // 🔒 Duplicate Aadhaar Check
            var existingByAadhaar = await _context.Employees
                .FirstOrDefaultAsync(e => e.Aadhaar == employee.Aadhaar);
            if (existingByAadhaar != null)
                return Conflict(new { message = "Employee with this Aadhaar already exists." });

            // 🔒 Duplicate Mobile Check
            var existingByMobile = await _context.Employees
                .FirstOrDefaultAsync(e =>
                    (e.Mobile1 == employee.Mobile1 || e.Mobile2 == employee.Mobile1 ||
                     e.Mobile1 == employee.Mobile2 || e.Mobile2 == employee.Mobile2)
                    && e.UserId == CurrentUserId);
            if (existingByMobile != null)
                return Conflict(new { message = "Employee with this Mobile Number already exists." });

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Create Employee Wallet
            var wallet = new EmployeeWallet
            {
                EmployeeId = employee.EmployeeId,
                AdvanceBalance = 0
            };

            _context.EmployeeWallets.Add(wallet);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetEmployee), new { id = employee.EmployeeId }, employee);
        }

        // ✅ PUT: Update Employee (Only User can update his own employees)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee(int id, [FromBody] Employee employee)
        {
            if (CurrentRole == "Admin")
                return Forbid("Admin cannot update employees");

            if (id != employee.EmployeeId)
                return BadRequest("not correct");

            var existingEmployee = await _context.Employees.AsNoTracking()
                .FirstOrDefaultAsync(e => e.EmployeeId == id);
            if (existingEmployee == null)
                return NotFound();

            if (existingEmployee.UserId != CurrentUserId)
                return Forbid();

            employee.UserId = CurrentUserId;

            // Duplicate Aadhaar check
            var existingByAadhaar = await _context.Employees
                .FirstOrDefaultAsync(e => e.Aadhaar == employee.Aadhaar &&
                                          e.EmployeeId != id &&
                                          e.UserId == CurrentUserId);
            if (existingByAadhaar != null)
                return Conflict(new { message = "Another employee with this Aadhaar already exists." });

            // Duplicate Mobile check
            var existingByMobile = await _context.Employees
                .FirstOrDefaultAsync(e =>
                    (e.Mobile1 == employee.Mobile1 || e.Mobile2 == employee.Mobile1 ||
                     e.Mobile1 == employee.Mobile2 || e.Mobile2 == employee.Mobile2)
                    && e.EmployeeId != id && e.UserId == CurrentUserId);
            if (existingByMobile != null)
                return Conflict(new { message = "Another employee with this Mobile Number already exists." });

            _context.Entry(employee).State = EntityState.Modified;
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

            // Delete Wallet if exists
            var wallet = await _context.EmployeeWallets
                .FirstOrDefaultAsync(w => w.EmployeeId == id);
            if (wallet != null)
                _context.EmployeeWallets.Remove(wallet);

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Employee deleted successfully." });
        }

        [HttpGet("employee_wallete")]

        public async Task<ActionResult<IEnumerable<EmployeeWallet>>> getemployeewalletes()
        {
            if (CurrentRole=="Admin")
                return Forbid("admin not view employee details.");
 
            var employeewallete = await _context.EmployeeWallets.ToListAsync();

            if (employeewallete == null) return NotFound();
            return employeewallete;

        }
    }
}
