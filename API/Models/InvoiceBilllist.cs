using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class InvoiceBilllist
    {
        [Key]
        public int InvoiceBilllistid { get; set; }  // PK     // FK
        public int Userid { get; set; }
        public int SrNo { get; set; }
        public string Description { get; set; }
        public string ServiceCode { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
