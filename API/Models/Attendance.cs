using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [Column(TypeName = "nvarchar(20)")] // ✅ Store as string
        public string Status { get; set; }

        [Required]
        [Column(TypeName = "date")] // ✅ Store only DATE (no time)
        public DateTime Date { get; set; }

        public int OT { get; set; } = 0;
        public DateTime createdAT { get; set; } = DateTime.Now;
    }
}
