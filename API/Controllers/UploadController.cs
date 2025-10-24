using FEMS_API.Database;
using FEMS_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace FEMS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;
        private readonly FEMS_DbContext _db;

        public UploadController(IWebHostEnvironment environment, FEMS_DbContext db)
        {
            _environment = environment;
            _db = db;
        }

        // 🔹 CREATE (Upload File + Save Path)
        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadPath = Path.Combine(_environment.WebRootPath, "uploads");
            if (!Directory.Exists(uploadPath))
                Directory.CreateDirectory(uploadPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = "/uploads/" + fileName;

            var imageRecord = new ImageRecord { FilePath = relativePath };
            _db.ImageRecords.Add(imageRecord);
            await _db.SaveChangesAsync();

            return Ok(imageRecord);
        }

        // 🔹 READ ALL
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var records = await Task.FromResult(_db.ImageRecords.ToList());
            return Ok(records);
        }

        // 🔹 READ BY ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var record = await _db.ImageRecords.FindAsync(id);
            if (record == null) return NotFound();
            return Ok(record);
        }

        // 🔹 UPDATE (Replace File)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, IFormFile file)
        {
            var record = await _db.ImageRecords.FindAsync(id);
            if (record == null) return NotFound("Record not found");

            if (file != null && file.Length > 0)
            {
                // Save new file
                var uploadPath = Path.Combine(_environment.WebRootPath, "uploads");
                if (!Directory.Exists(uploadPath))
                    Directory.CreateDirectory(uploadPath);

                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
                var filePath = Path.Combine(uploadPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Delete old file
                var oldFilePath = Path.Combine(_environment.WebRootPath, record.FilePath.TrimStart('/'));
                if (System.IO.File.Exists(oldFilePath))
                    System.IO.File.Delete(oldFilePath);

                // Update DB path
                record.FilePath = "/uploads/" + fileName;
                _db.ImageRecords.Update(record);
                await _db.SaveChangesAsync();
            }

            return Ok(record);
        }

        // 🔹 DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var record = await _db.ImageRecords.FindAsync(id);
            if (record == null) return NotFound();

            // Delete file from folder
            var filePath = Path.Combine(_environment.WebRootPath, record.FilePath.TrimStart('/'));
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            // Delete from DB
            _db.ImageRecords.Remove(record);
            await _db.SaveChangesAsync();

            return Ok("Deleted successfully");
        }
    }
}
