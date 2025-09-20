using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class UserWallet
    {
        [Key]
        public int UserWalletId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public decimal Balance { get; set; } = 0;
    }
}
