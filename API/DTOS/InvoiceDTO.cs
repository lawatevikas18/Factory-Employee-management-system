namespace FEMS_API.DTOS
{
    public class InvoiceDTO
    {
        public string? Address { get; set; }
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
        public string? CustomerName { get; set; }
        public string? CustomerAddress { get; set; }
        public string? CustomerGSTIN { get; set; }
        public string? CustomerState { get; set; }
        public string? CustomerStateCode { get; set; }
        public decimal IGSTRate { get; set; }
        public decimal CGSTRate { get; set; }
        public decimal SGSTRate { get; set; }
        public List<InvoiceItemDTO> Items { get; set; }
    }

    public class InvoiceItemDTO
    {
        public int SrNo { get; set; }
        public string Description { get; set; }
        public string ServiceCode { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public decimal Rate { get; set; }
        public decimal Amount { get; set; }
    }
}
