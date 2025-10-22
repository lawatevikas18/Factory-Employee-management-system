using System.ComponentModel.DataAnnotations;

namespace FEMS_API.DTOS
{
    public class AdminToUser_transferDTO
    {
         
        [Required]
        public int UserId { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [MaxLength(250)]
        public string? Reason { get; set; }

        [MaxLength(50)]
        public string PaymentMode { get; set; }


        [Required]
        public string payment_catagaory { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime Date_of_transfer { get; set; }


        [Required]
        public DateTime CreatedAT { get; set; } = DateTime.Now;


    }
}
