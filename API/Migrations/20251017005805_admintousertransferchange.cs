using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FEMS_API.Migrations
{
    /// <inheritdoc />
    public partial class admintousertransferchange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Date",
                table: "AdminToUserTransactions",
                newName: "Date_of_transfer");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAT",
                table: "AdminToUserTransactions",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAT",
                table: "AdminToUserTransactions");

            migrationBuilder.RenameColumn(
                name: "Date_of_transfer",
                table: "AdminToUserTransactions",
                newName: "Date");
        }
    }
}
