using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoiceBilllistController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public InvoiceBilllistController(FEMS_DbContext context)
        {
            _context = context;
        }

        // GET: api/InvoiceBilllist
        [HttpGet]
        public async Task<ActionResult<IEnumerable<InvoiceBilllist>>> GetAll()
        {
            return await _context.InvoiceBilllistS.ToListAsync();
        }

        // GET: api/InvoiceBilllist/5
        [HttpGet("{id}")]
        public async Task<ActionResult<InvoiceBilllist>> GetById(int id)
        {
            var invoice = await _context.InvoiceBilllistS.FindAsync(id);
            if (invoice == null) return NotFound();
            return invoice;
        }

        // POST: api/InvoiceBilllist
        [HttpPost]
        public async Task<ActionResult<InvoiceBilllist>> Create(InvoiceBilllist invoiceBilllist)
        {
            _context.InvoiceBilllistS.Add(invoiceBilllist);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = invoiceBilllist.InvoiceBilllistid }, invoiceBilllist);
        }

        // PUT: api/InvoiceBilllist/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, InvoiceBilllist invoiceBilllist)
        {
            if (id != invoiceBilllist.InvoiceBilllistid) return BadRequest();

            _context.Entry(invoiceBilllist).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/InvoiceBilllist/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var invoice = await _context.InvoiceBilllistS.FindAsync(id);
            if (invoice == null) return NotFound();

            _context.InvoiceBilllistS.Remove(invoice);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
