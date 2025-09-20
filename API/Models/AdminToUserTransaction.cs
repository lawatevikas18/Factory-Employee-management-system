using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class AdminToUserTransaction
    {
        [Key]
        public int TransactionId { get; set; }

        [Required]
        public int AdminId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [MaxLength(250)]
        public string? Reason { get; set; }

        [Required]
        public DateTime Date { get; set; }
    }
}
