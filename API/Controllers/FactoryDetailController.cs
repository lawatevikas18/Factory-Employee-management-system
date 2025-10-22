using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactoryDetailController : ControllerBase
    {
        private readonly FEMS_DbContext _context;

        public FactoryDetailController(FEMS_DbContext context)
        {
            _context = context;
        }

        // GET: api/FactoryDetail
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FactoryDetail>>> GetAll()
        {
            return await _context.FactoryDetails.ToListAsync();
        }

        // GET: api/FactoryDetail/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FactoryDetail>> GetById(int id)
        {
            var factory = await _context.FactoryDetails.FindAsync(id);
            if (factory == null) return NotFound();
            return factory;
        }

        // POST: api/FactoryDetail
        [HttpPost]
        public async Task<ActionResult<FactoryDetail>> Create(FactoryDetail factoryDetail)
        {
            _context.FactoryDetails.Add(factoryDetail);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = factoryDetail.factorydetailsID }, factoryDetail);
        }

        // PUT: api/FactoryDetail/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, FactoryDetail factoryDetail)
        {
            if (id != factoryDetail.factorydetailsID) return BadRequest();

            _context.Entry(factoryDetail).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/FactoryDetail/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var factory = await _context.FactoryDetails.FindAsync(id);
            if (factory == null) return NotFound();

            _context.FactoryDetails.Remove(factory);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
