using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class SalaryTransaction
    {
        [Key]
        public int SalaryId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        public string Month { get; set; } // e.g., "2025-09"

        [Required]
        public int PresentDays { get; set; }

        [Required]
        public int AbsentDays { get; set; }

        [Required]
        public int HalfDays { get; set; }

        [Required]
        public decimal TotalSalary { get; set; }

        [Required]
        public decimal AdvanceDeducted { get; set; }

        [Required]
        public decimal FinalSalary { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }

}
