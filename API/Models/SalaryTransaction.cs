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
        [DataType(DataType.Date)]
        public DateTime StartDate { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime EndDate { get; set; }

        public string Month { get; set; }

        [Required]
        public int PresentDays { get; set; }

        [Required]
        public int AbsentDays { get; set; }

        [Required]
        public int HalfDays { get; set; }

        public int TotalOTHours { get; set; }

        [Required]
        public decimal TotalSalary { get; set; }

        [Required]
        public decimal AdvanceDeducted { get; set; }

        [Required]
        public decimal FinalSalary { get; set; }


        [Required]
        public DateTime CreatedAT { get; set; }= DateTime.Now;
    }
}
