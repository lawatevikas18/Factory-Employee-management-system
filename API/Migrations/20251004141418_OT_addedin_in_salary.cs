using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FEMS_API.Migrations
{
    /// <inheritdoc />
    public partial class OT_addedin_in_salary : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TotalOTHours",
                table: "SalaryTransactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TotalOTHours",
                table: "SalaryTransactions");
        }
    }
}
