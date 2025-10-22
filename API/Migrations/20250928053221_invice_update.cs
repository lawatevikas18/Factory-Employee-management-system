using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FEMS_API.Migrations
{
    /// <inheritdoc />
    public partial class invice_update : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CompanyName",
                table: "Invoices",
                newName: "FactoryName");

            migrationBuilder.AddColumn<int>(
                name: "Userid",
                table: "Invoices",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Userid",
                table: "Invoices");

            migrationBuilder.RenameColumn(
                name: "FactoryName",
                table: "Invoices",
                newName: "CompanyName");
        }
    }
}
