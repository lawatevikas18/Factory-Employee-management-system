using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class AdminWallet
    {
        [Key]
        public int AdminWalletId { get; set; }

        [Required]
        public int AdminId { get; set; }

        [Required]
        public decimal Balance { get; set; } = 0;
    }
}
