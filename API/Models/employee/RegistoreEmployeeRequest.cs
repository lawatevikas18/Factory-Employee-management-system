namespace Auth.Api.Models.employee
{
    public class RegistoreEmployeeRequest
    {
        public string adminName { get; set; }
        public string role { get; set; }
        public string adminId { get; set; }

        public string action { get; set; }


        public List<employeeDetails> empLoyeeDetails { get; set; }
    }
    public class employeeDetails
    {
        public string factoryName { get; set; }
        public string employeeName { get; set; }
        public string employeeCode { get; set; }
        public string address { get; set; }
        public string village { get; set; }
        public string taluka { get; set; }
        public string district { get; set; }
        public string state { get; set; }
        public string designation { get; set; }
        public string aadhar { get; set; }
        public string pan { get; set; }
        public string mobile1 { get; set; }
        public string mobile2 { get; set; }
    }
}
