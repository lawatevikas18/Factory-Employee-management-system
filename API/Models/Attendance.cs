using System.ComponentModel.DataAnnotations;
using FEMS_API.Enums;

namespace FEMS_API.Models
{
    public class Attendance
    {
        [Key]
        public int AttendanceId { get; set; }

        [Required]
        public int EmployeeId { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public AttendanceStatus Status { get; set; } // Enum => Present, Absent, HalfDay, Leave

        [Required]
        public DateTime Date { get; set; }
    }
}
