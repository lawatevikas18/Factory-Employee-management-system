using System.ComponentModel.DataAnnotations;

namespace FEMS_API.DTOS
{
    public class AttendanceDTO
    {
        [Required(ErrorMessage = "EmployeeId is required.")]
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public string Status { get; set; }  // ✅ Now string (no enum)

        [Required(ErrorMessage = "Date is required.")]
        [DataType(DataType.Date)]
        public DateTime Date { get; set; }

        public int OT { get; set; } = 0;
    }
}
