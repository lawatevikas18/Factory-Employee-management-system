using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        public int AdminId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        [MaxLength(250)]
        public string Address { get; set; }

        [Required]
        [MaxLength(12)]
        public string Aadhaar { get; set; }

        [MaxLength(10)]
        public string PanCard { get; set; }

        [Required]
        [MaxLength(10)]
        public string MobileNumber { get; set; }
        [Required] public string Role { get; set; }
        [Required] public string FactoryName { get; set; }
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }


    }
}
 
 