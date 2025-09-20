using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class FactoryBill
    {
        [Key]
        public int BillId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public string FactoryName { get; set; }

        [Required]
        public DateTime FromDate { get; set; }

        [Required]
        public DateTime ToDate { get; set; }

        public string WorkDescription { get; set; }

        public decimal TotalBill { get; set; }

        public decimal PaidAmount { get; set; }

        public decimal PendingAmount { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}
