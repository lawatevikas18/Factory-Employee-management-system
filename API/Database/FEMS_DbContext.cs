using FEMS_API.Models;
using Microsoft.EntityFrameworkCore;

namespace FEMS_API.Database
{
    public class FEMS_DbContext : DbContext
    {
        public FEMS_DbContext(DbContextOptions<FEMS_DbContext> options) : base(options)
        {
        }

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

        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<InvoiceItem> InvoiceItems { get; set; }

        public DbSet<InvoiceBilllist> InvoiceBilllistS { get; set; }
        public DbSet<FactoryDetail> FactoryDetails { get; set; }

        public DbSet<ImageRecord> ImageRecords { get; set; }




        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // ✅ Store AttendanceStatus as string
            modelBuilder.Entity<Attendance>()
                .Property(a => a.Status)
                .HasConversion<string>();

            // ✅ Configure SalaryTransaction to store date-only fields
            modelBuilder.Entity<SalaryTransaction>()
                .Property(s => s.StartDate)
                .HasColumnType("date");

            modelBuilder.Entity<SalaryTransaction>()
                .Property(s => s.EndDate)
                .HasColumnType("date");


            // ✅ Configure Attendance date field
            modelBuilder.Entity<Attendance>()
                .Property(a => a.Date)
                .HasColumnType("date");

            // ✅ Configure FactoryBill date fields
            modelBuilder.Entity<FactoryBill>()
                .Property(f => f.FromDate)
                .HasColumnType("date");

            modelBuilder.Entity<FactoryBill>()
                .Property(f => f.ToDate)
                .HasColumnType("date");

            // ✅ Configure FactoryReport date fields
            modelBuilder.Entity<FactoryReport>()
                .Property(fr => fr.StartDate)
                .HasColumnType("date");

            modelBuilder.Entity<FactoryReport>()
                .Property(fr => fr.EndDate)
                .HasColumnType("date");

            modelBuilder.Entity<Invoice>()
             .HasMany(i => i.Itemdatas)
             .WithOne(item => item.Invoice)
             .HasForeignKey(item => item.InvoiceId)
             .OnDelete(DeleteBehavior.Cascade);

 

            base.OnModelCreating(modelBuilder);
        }
    }
}
