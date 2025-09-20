using System.ComponentModel.DataAnnotations;
using FEMS_API.Enums;

namespace FEMS_API.DTOS
{
    public class AttendanceDTO
    {
        [Required(ErrorMessage = "EmployeeId is required.")]
        public int EmployeeId { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public AttendanceStatus Status { get; set; } // Enum (Dropdown in Swagger)

        [Required(ErrorMessage = "Date is required.")]
        public DateTime Date { get; set; }
    }
}
