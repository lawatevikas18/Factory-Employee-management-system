using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class EmployeeWallet
    {
        [Key]
        public int EmployeeWalletId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public decimal AdvanceBalance { get; set; } = 0;
    }
}
