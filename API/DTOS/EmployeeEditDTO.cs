using System.ComponentModel.DataAnnotations;

namespace FEMS_API.DTOS
{
    public class EmployeeEditDTO
    {

        public int EmployeeId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
 
        public string? Address { get; set; }

    
        public string? Village { get; set; }

  
        public string? Taluka { get; set; }
 
        public string? District { get; set; }

 
        public string? State { get; set; }
        [Required]
        public string Role { get; set; }

        [Required]
        [MaxLength(12)]
        public string Aadhaar { get; set; }

 
        public string? PanCard { get; set; }

        [Required]
        [MaxLength(10)]
        public string Mobile1 { get; set; }

         
        public string? Mobile2 { get; set; }

        [Required]
        public decimal MonthlySalary { get; set; }

        public IFormFile? Image { get; set; }


    }
}
