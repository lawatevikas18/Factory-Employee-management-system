using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class AdvanceTransaction
    {
        [Key]
        public int AdvanceId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int UserId { get; set; }

        [MaxLength(250)]
        public string Reason { get; set; }

        [MaxLength(50)]
        public string PaymentMode { get; set; }


        [Required]
        public string payment_catagaory { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        [Required] 
        public DateTime CreatedAT { get; set; }= DateTime.Now;
    }
}
