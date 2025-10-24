using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FEMS_API.Migrations
{
    /// <inheritdoc />
    public partial class payment_catagaory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "payment_catagaory",
                table: "AdvanceTransactions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "payment_catagaory",
                table: "AdvanceTransactions");
        }
    }
}
