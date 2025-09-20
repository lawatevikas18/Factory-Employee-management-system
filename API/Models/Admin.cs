using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
