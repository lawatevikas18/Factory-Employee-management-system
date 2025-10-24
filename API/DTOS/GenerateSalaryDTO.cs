using System.ComponentModel.DataAnnotations;

namespace FEMS_API.DTOS
{
    public class GenerateSalaryDTO
    {
        [Required(ErrorMessage = "EmployeeId is required.")]
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "StartDate is required.")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "EndDate is required.")]
        public DateTime EndDate { get; set; }

        public decimal ManualAdvanceDeduct { get; set; }
    }
}
