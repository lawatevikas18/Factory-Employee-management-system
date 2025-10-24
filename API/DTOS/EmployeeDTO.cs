using System.ComponentModel.DataAnnotations;

namespace FEMS_API.DTOS
{
    public class EmployeeDto
    {
        [Required]
        public string Name { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{10}$")]
        public string Mobile1 { get; set; }

        public string? Mobile2 { get; set; }   // ✅ optional, null save होईल

        [Required]
        public string Role { get; set; }   // ✅ required, null allow नाही

        [Required]
        public decimal MonthlySalary { get; set; }

        [Required]
        [RegularExpression(@"^[0-9]{12}$")]
        public string Aadhaar { get; set; }

        public string? PanCard { get; set; }   // ✅ optional
        public string? Address { get; set; }   // ✅ optional
        public string? Village { get; set; }   // ✅ optional
        public string? Taluka { get; set; }    // ✅ optional
        public string? District { get; set; }  // ✅ optional
        public string? State { get; set; }     // ✅ optional

        public IFormFile? Image { get; set; } // ✅ optional, null ठेवू शकतो
    }
}
