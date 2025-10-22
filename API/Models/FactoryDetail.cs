using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class FactoryDetail
    {
        [Key]
        public int factorydetailsID { get; set; }   // PK
        public int Userid { get; set; }
        public string FactoryName { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string GSTIN { get; set; }
        public string PANNo { get; set; }
        public string StateCode { get; set; }
        public string State { get; set; }
        public string InvoiceNo { get; set; }
        public string WorkOrderNo { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerGSTIN { get; set; }
        public string CustomerState { get; set; }
        public string CustomerStateCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

    }
}
