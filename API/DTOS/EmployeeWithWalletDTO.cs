namespace FEMS_API.DTOS
{

    public class EmployeeWithWalletDTO
    {
        public int EmployeeId { get; set; }
        public string? Name { get; set; }       // <- nullable
        public string? Address { get; set; }
        public string? Village { get; set; }
        public string? Taluka { get; set; }
        public string? District { get; set; }
        public string? State { get; set; }
        public string? Role { get; set; }
        public string? Aadhaar { get; set; }
        public string? PanCard { get; set; }
        public string? Mobile1 { get; set; }
        public string? Mobile2 { get; set; }
        public decimal? MonthlySalary { get; set; }  // <- nullable
        public string? FactoryName { get; set; }
        public string? ImagePath { get; set; }
        public decimal AdvanceBalance { get; set; }  // If always 0 when null, can keep non-nullable
    }


}
