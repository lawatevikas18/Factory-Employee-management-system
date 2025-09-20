using FEMS_API.Models;
using Microsoft.EntityFrameworkCore;
namespace FEMS_API.Database
{
    public class FEMS_DbContext(DbContextOptions<FEMS_DbContext> options) : DbContext(options)
    {
            public DbSet<Admin> Admins { get; set; }
            public DbSet<AdminWallet> AdminWallets { get; set; }
            public DbSet<User> Users { get; set; }
            public DbSet<UserWallet> UserWallets { get; set; }
            public DbSet<Employee> Employees { get; set; }
            public DbSet<EmployeeWallet> EmployeeWallets { get; set; }
            public DbSet<Attendance> Attendances { get; set; }
            public DbSet<AdvanceTransaction> AdvanceTransactions { get; set; }
            public DbSet<SalaryTransaction> SalaryTransactions { get; set; }
            public DbSet<AdminToUserTransaction> AdminToUserTransactions { get; set; }
            public DbSet<FactoryBill> FactoryBills { get; set; }
            public DbSet<FactoryReport> FactoryReports { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ✅ This makes EF store AttendanceStatus as string instead of int
            modelBuilder.Entity<Attendance>()
                .Property(a => a.Status)
                .HasConversion<string>();

            base.OnModelCreating(modelBuilder);
        }

    }
    }

