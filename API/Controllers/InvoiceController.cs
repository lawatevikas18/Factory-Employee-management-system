using FEMS_API.Database;
using FEMS_API.DTOS;
using FEMS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public InvoiceController(FEMS_DbContext context)
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

        // ✅ Create Invoice
        [HttpPost("create")]
        public async Task<IActionResult> CreateInvoice([FromBody] InvoiceDTO dto)
        {
            if (CurrentRole == "Admin") return BadRequest("Admin cannot create invoices");
            if (dto == null) return BadRequest("Invalid data");

            var invoice = new Invoice
            {
                FactoryName = CurrentfactoryName,
                Userid = CurrentUserId,
                Address = dto.Address,
                Description = dto.Description,
                GSTIN = dto.GSTIN,
                PANNo = dto.PANNo,
                StateCode = dto.StateCode,
                State = dto.State,
                InvoiceNo = dto.InvoiceNo,
                InvoiceDate = dto.InvoiceDate.Date,
                WorkOrderNo = dto.WorkOrderNo,
                WorkingPeriodFrom = dto.WorkingPeriodFrom.Date,
                WorkingPeriodTo = dto.WorkingPeriodTo.Date,
                CustomerName = dto.CustomerName,
                CustomerAddress = dto.CustomerAddress,
                CustomerGSTIN = dto.CustomerGSTIN,
                CustomerState = dto.CustomerState,
                CustomerStateCode = dto.CustomerStateCode,
                IGSTRate = dto.IGSTRate,
                CGSTRate = dto.CGSTRate,
                SGSTRate = dto.SGSTRate,
                CreatedAt = DateTime.Now,
                Itemdatas = dto.Items.Select(i => new InvoiceItem
                {
                    SrNo = i.SrNo,
                    Description = i.Description,
                    ServiceCode = i.ServiceCode,
                    Quantity = i.Quantity,
                    Unit = i.Unit,
                    Rate = i.Rate,
                    Amount = i.Amount
                }).ToList()
            };

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Invoice created successfully", invoiceId = invoice.InvoiceId });
        }

        // ✅ Get All Invoices (DTO वापरून)
        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<InvoiceDTO>>> GetAllInvoices()
        {
            var query = _context.Invoices.Include(i => i.Itemdatas).AsQueryable();

            if (CurrentRole != "Admin")
                query = query.Where(a => a.Userid == CurrentUserId);

            var invoices = await query.ToListAsync();

            var dtoList = invoices.Select(MapToDTO).ToList();
            return Ok(dtoList);
        }


        //[HttpGet("factorydetails")]
        //public async Task<ActionResult<IEnumerable<InvoiceDTO>>> Getfactorydetails()
        //{
        //    var query = _context.Include(i => i.Itemdatas).AsQueryable();

        //    if (CurrentRole != "Admin")
        //        query = query.Where(a => a.Userid == CurrentUserId);

        //    var invoices = await query.ToListAsync();

        //    var dtoList = invoices.Select(MapToDTO).ToList();
        //    return Ok(dtoList);
        //}



        // ✅ Get Invoice By Id (DTO वापरून)
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceDTO>> GetInvoiceById(int id)
        {
            var invoice = await _context.Invoices
                .Include(i => i.Itemdatas)
                .FirstOrDefaultAsync(i => i.InvoiceId == id && i.Userid == CurrentUserId);

            if (invoice == null) return NotFound("Invoice not found");

            return Ok(MapToDTO(invoice));
        }

        // ✅ Update Invoice
        [HttpPut("update/{id}")]
        public async Task<IActionResult> UpdateInvoice(int id, [FromBody] InvoiceDTO dto)
        {
            if (CurrentRole == "Admin") return BadRequest("Admin cannot update invoices");

            var invoice = await _context.Invoices
                .Include(i => i.Itemdatas)
                .FirstOrDefaultAsync(i => i.InvoiceId == id && i.Userid == CurrentUserId);

            if (invoice == null) return NotFound("Invoice not found");

            // Update main invoice fields
            invoice.FactoryName = CurrentfactoryName;
            invoice.Userid = CurrentUserId;
            invoice.Address = dto.Address;
            invoice.Description = dto.Description;
            invoice.GSTIN = dto.GSTIN;
            invoice.PANNo = dto.PANNo;
            invoice.StateCode = dto.StateCode;
            invoice.State = dto.State;
            invoice.InvoiceNo = dto.InvoiceNo;
            invoice.InvoiceDate = dto.InvoiceDate.Date;
            invoice.WorkOrderNo = dto.WorkOrderNo;
            invoice.WorkingPeriodFrom = dto.WorkingPeriodFrom.Date;
            invoice.WorkingPeriodTo = dto.WorkingPeriodTo.Date;
            invoice.CustomerName = dto.CustomerName;
            invoice.CustomerAddress = dto.CustomerAddress;
            invoice.CustomerGSTIN = dto.CustomerGSTIN;
            invoice.CustomerState = dto.CustomerState;
            invoice.CustomerStateCode = dto.CustomerStateCode;
            invoice.IGSTRate = dto.IGSTRate;
            invoice.CGSTRate = dto.CGSTRate;
            invoice.SGSTRate = dto.SGSTRate;

            // Replace items
            _context.InvoiceItems.RemoveRange(invoice.Itemdatas);
            invoice.Itemdatas = dto.Items.Select(i => new InvoiceItem
            {
                SrNo = i.SrNo,
                Description = i.Description,
                ServiceCode = i.ServiceCode,
                Quantity = i.Quantity,
                Unit = i.Unit,
                Rate = i.Rate,
                Amount = i.Amount
            }).ToList();

            await _context.SaveChangesAsync();
            return Ok(new { message = "Invoice updated successfully" });
        }

        // ✅ Delete Invoice
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteInvoice(int id)
        {
            if (CurrentRole == "Admin") return BadRequest("Admin cannot delete invoices");

            var invoice = await _context.Invoices
                .Include(i => i.Itemdatas)
                .FirstOrDefaultAsync(i => i.InvoiceId == id && i.Userid == CurrentUserId);

            if (invoice == null) return NotFound("Invoice not found");

            _context.InvoiceItems.RemoveRange(invoice.Itemdatas);
            _context.Invoices.Remove(invoice);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Invoice deleted successfully" });
        }

        // 🔄 Helper method: Entity → DTO
        private InvoiceDTO MapToDTO(Invoice invoice)
        {
            return new InvoiceDTO
            {
                Address = invoice.Address,
                Description = invoice.Description,
                GSTIN = invoice.GSTIN,
                PANNo = invoice.PANNo,
                StateCode = invoice.StateCode,
                State = invoice.State,
                InvoiceNo = invoice.InvoiceNo,
                InvoiceDate = invoice.InvoiceDate,
                WorkOrderNo = invoice.WorkOrderNo,
                WorkingPeriodFrom = invoice.WorkingPeriodFrom,
                WorkingPeriodTo = invoice.WorkingPeriodTo,
                CustomerName = invoice.CustomerName,
                CustomerAddress = invoice.CustomerAddress,
                CustomerGSTIN = invoice.CustomerGSTIN,
                CustomerState = invoice.CustomerState,
                CustomerStateCode = invoice.CustomerStateCode,
                IGSTRate = invoice.IGSTRate,
                CGSTRate = invoice.CGSTRate,
                SGSTRate = invoice.SGSTRate,
                Items = invoice.Itemdatas.Select(x => new InvoiceItemDTO
                {
                    SrNo = x.SrNo,
                    Description = x.Description,
                    ServiceCode = x.ServiceCode,
                    Quantity = x.Quantity,
                    Unit = x.Unit,
                    Rate = x.Rate,
                    Amount = x.Amount
                }).ToList()
            };
        }
    }
}
