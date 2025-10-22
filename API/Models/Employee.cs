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
            public string? Name { get; set; }  // ← made nullable to handle DB null safely

            public string? Address { get; set; }
            public string? Village { get; set; }
            public string? Taluka { get; set; }
            public string? District { get; set; }
            public string? State { get; set; }

            [Required]
            public string? Role { get; set; }  // ← made nullable

            [Required]
            [MaxLength(12)]
            public string? Aadhaar { get; set; }  // ← made nullable

            public string? PanCard { get; set; }

            [Required]
            [MaxLength(10)]
            public string? Mobile1 { get; set; }  // ← made nullable

            [MaxLength(10)]
            public string? Mobile2 { get; set; }

            [Required]
            public decimal MonthlySalary { get; set; }

            [Required]
            public string? FactoryName { get; set; }  // ← made nullable

            public DateTime createdAT { get; set; } = DateTime.Now;

            public string? ImagePath { get; set; }

            public bool IsActive { get; set; } = true;
        }
    }
