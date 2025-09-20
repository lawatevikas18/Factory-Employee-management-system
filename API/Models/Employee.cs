using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class Employee
    {
        [Key]
        public int EmployeeId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string Address { get; set; }

        [MaxLength(100)]
        public string Village { get; set; }

        [MaxLength(100)]
        public string Taluka { get; set; }

        [MaxLength(100)]
        public string District { get; set; }

        [MaxLength(50)]
        public string State { get; set; }

        [MaxLength(50)]
        public string Role { get; set; }

        [MaxLength(12)]
        public string Aadhaar { get; set; }

        [MaxLength(10)]
        public string PanCard { get; set; }

        [MaxLength(15)]
        public string Mobile1 { get; set; }

        [MaxLength(15)]
        public string Mobile2 { get; set; }

        [Required]
        public decimal MonthlySalary { get; set; }

        [MaxLength(100)]
        public string FactoryName { get; set; }
    }
}
