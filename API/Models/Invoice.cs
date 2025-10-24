namespace FEMS_API.Models
{
    public class Invoice
    {
        public int InvoiceId { get; set; }   // PK
        public int Userid { get; set; }
        public string FactoryName { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public string GSTIN { get; set; }
        public string PANNo { get; set; }
        public string StateCode { get; set; }
        public string State { get; set; }
        public string InvoiceNo { get; set; }
        public DateTime InvoiceDate { get; set; }
        public string WorkOrderNo { get; set; }
        public DateTime WorkingPeriodFrom { get; set; }
        public DateTime WorkingPeriodTo { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerGSTIN { get; set; }
        public string CustomerState { get; set; }
        public string CustomerStateCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Tax details
        public decimal IGSTRate { get; set; }
        public decimal CGSTRate { get; set; }
        public decimal SGSTRate { get; set; }

        // Navigation
        public ICollection<InvoiceItem> Itemdatas { get; set; }
    }

    public class InvoiceItem
    {
        public int InvoiceItemId { get; set; }  // PK
        public int InvoiceId { get; set; }      // FK

        public int SrNo { get; set; }
        public string Description { get; set; }
        public string ServiceCode { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }

        public Invoice Invoice { get; set; }
    }
}