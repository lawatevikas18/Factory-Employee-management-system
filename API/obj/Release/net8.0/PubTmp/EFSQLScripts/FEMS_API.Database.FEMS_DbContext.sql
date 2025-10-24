IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [Admins] (
        [AdminId] int NOT NULL IDENTITY,
        [Name] nvarchar(100) NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_Admins] PRIMARY KEY ([AdminId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [AdminToUserTransactions] (
        [TransactionId] int NOT NULL IDENTITY,
        [AdminId] int NOT NULL,
        [UserId] int NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Reason] nvarchar(250) NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_AdminToUserTransactions] PRIMARY KEY ([TransactionId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [AdminWallets] (
        [AdminWalletId] int NOT NULL IDENTITY,
        [AdminId] int NOT NULL,
        [Balance] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_AdminWallets] PRIMARY KEY ([AdminWalletId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [AdvanceTransactions] (
        [AdvanceId] int NOT NULL IDENTITY,
        [EmployeeId] int NOT NULL,
        [UserId] int NOT NULL,
        [Reason] nvarchar(250) NOT NULL,
        [PaymentMode] nvarchar(50) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_AdvanceTransactions] PRIMARY KEY ([AdvanceId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [Attendances] (
        [AttendanceId] int NOT NULL IDENTITY,
        [EmployeeId] int NOT NULL,
        [UserId] int NOT NULL,
        [Status] nvarchar(20) NOT NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_Attendances] PRIMARY KEY ([AttendanceId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [Employees] (
        [EmployeeId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [Address] nvarchar(250) NOT NULL,
        [Village] nvarchar(100) NOT NULL,
        [Taluka] nvarchar(100) NOT NULL,
        [District] nvarchar(100) NOT NULL,
        [State] nvarchar(50) NOT NULL,
        [Role] nvarchar(50) NOT NULL,
        [Aadhaar] nvarchar(12) NOT NULL,
        [PanCard] nvarchar(10) NOT NULL,
        [Mobile1] nvarchar(15) NOT NULL,
        [Mobile2] nvarchar(15) NOT NULL,
        [MonthlySalary] decimal(18,2) NOT NULL,
        [FactoryName] nvarchar(100) NOT NULL,
        CONSTRAINT [PK_Employees] PRIMARY KEY ([EmployeeId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [EmployeeWallets] (
        [EmployeeWalletId] int NOT NULL IDENTITY,
        [EmployeeId] int NOT NULL,
        [AdvanceBalance] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_EmployeeWallets] PRIMARY KEY ([EmployeeWalletId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [FactoryBills] (
        [BillId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [FactoryName] nvarchar(max) NOT NULL,
        [FromDate] datetime2 NOT NULL,
        [ToDate] datetime2 NOT NULL,
        [WorkDescription] nvarchar(max) NOT NULL,
        [TotalBill] decimal(18,2) NOT NULL,
        [PaidAmount] decimal(18,2) NOT NULL,
        [PendingAmount] decimal(18,2) NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        CONSTRAINT [PK_FactoryBills] PRIMARY KEY ([BillId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [FactoryReports] (
        [Id] int NOT NULL IDENTITY,
        [FactoryName] nvarchar(max) NOT NULL,
        [UserId] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [CreatedDate] datetime2 NOT NULL,
        [SugarPacking50Kg] decimal(18,2) NOT NULL,
        [HamalKamgarPagar] decimal(18,2) NOT NULL,
        [SugarHouseSilaiKamgarPagar] decimal(18,2) NOT NULL,
        [TotalKamgarPagar] decimal(18,2) NOT NULL,
        [VarniMukadamSankhya] int NOT NULL,
        [MukadamVarniCharge] decimal(18,2) NOT NULL,
        [MukadamVarniRakkam] decimal(18,2) NOT NULL,
        [RackVarniMukadamSankhya] int NOT NULL,
        [RackMukadamVarniCharge] decimal(18,2) NOT NULL,
        [RackVarniTotalRakkam] decimal(18,2) NOT NULL,
        [TotalLoadingTonnage] decimal(18,2) NOT NULL,
        [TonnageCharge] decimal(18,2) NOT NULL,
        [TotalTonnageRakkam] decimal(18,2) NOT NULL,
        [TotalAssamHamal] int NOT NULL,
        [AssamHamalCharges] decimal(18,2) NOT NULL,
        [TotalAssamVarniRakkam] decimal(18,2) NOT NULL,
        [FinalTotal] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_FactoryReports] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [SalaryTransactions] (
        [SalaryId] int NOT NULL IDENTITY,
        [EmployeeId] int NOT NULL,
        [UserId] int NOT NULL,
        [StartDate] datetime2 NOT NULL,
        [EndDate] datetime2 NOT NULL,
        [Month] nvarchar(max) NOT NULL,
        [PresentDays] int NOT NULL,
        [AbsentDays] int NOT NULL,
        [HalfDays] int NOT NULL,
        [TotalSalary] decimal(18,2) NOT NULL,
        [AdvanceDeducted] decimal(18,2) NOT NULL,
        [FinalSalary] decimal(18,2) NOT NULL,
        [Date] datetime2 NOT NULL,
        CONSTRAINT [PK_SalaryTransactions] PRIMARY KEY ([SalaryId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [Users] (
        [UserId] int NOT NULL IDENTITY,
        [AdminId] int NOT NULL,
        [Name] nvarchar(100) NOT NULL,
        [Address] nvarchar(250) NOT NULL,
        [Aadhaar] nvarchar(12) NOT NULL,
        [PanCard] nvarchar(10) NOT NULL,
        [MobileNumber] nvarchar(10) NOT NULL,
        [Role] nvarchar(max) NOT NULL,
        [FactoryName] nvarchar(max) NOT NULL,
        [PasswordHash] varbinary(max) NOT NULL,
        [PasswordSalt] varbinary(max) NOT NULL,
        CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    CREATE TABLE [UserWallets] (
        [UserWalletId] int NOT NULL IDENTITY,
        [UserId] int NOT NULL,
        [Balance] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_UserWallets] PRIMARY KEY ([UserWalletId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250915152747_start'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250915152747_start', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250919165421_attendance'
)
BEGIN
    DECLARE @var0 sysname;
    SELECT @var0 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Attendances]') AND [c].[name] = N'Status');
    IF @var0 IS NOT NULL EXEC(N'ALTER TABLE [Attendances] DROP CONSTRAINT [' + @var0 + '];');
    ALTER TABLE [Attendances] ALTER COLUMN [Status] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250919165421_attendance'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250919165421_attendance', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    EXEC sp_rename N'[SalaryTransactions].[Date]', N'CreatedAT', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [UserWallets] ADD [CreatedAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [Users] ADD [createdAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var1 sysname;
    SELECT @var1 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SalaryTransactions]') AND [c].[name] = N'StartDate');
    IF @var1 IS NOT NULL EXEC(N'ALTER TABLE [SalaryTransactions] DROP CONSTRAINT [' + @var1 + '];');
    ALTER TABLE [SalaryTransactions] ALTER COLUMN [StartDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var2 sysname;
    SELECT @var2 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[SalaryTransactions]') AND [c].[name] = N'EndDate');
    IF @var2 IS NOT NULL EXEC(N'ALTER TABLE [SalaryTransactions] DROP CONSTRAINT [' + @var2 + '];');
    ALTER TABLE [SalaryTransactions] ALTER COLUMN [EndDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var3 sysname;
    SELECT @var3 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FactoryReports]') AND [c].[name] = N'StartDate');
    IF @var3 IS NOT NULL EXEC(N'ALTER TABLE [FactoryReports] DROP CONSTRAINT [' + @var3 + '];');
    ALTER TABLE [FactoryReports] ALTER COLUMN [StartDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var4 sysname;
    SELECT @var4 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FactoryReports]') AND [c].[name] = N'EndDate');
    IF @var4 IS NOT NULL EXEC(N'ALTER TABLE [FactoryReports] DROP CONSTRAINT [' + @var4 + '];');
    ALTER TABLE [FactoryReports] ALTER COLUMN [EndDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var5 sysname;
    SELECT @var5 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FactoryBills]') AND [c].[name] = N'ToDate');
    IF @var5 IS NOT NULL EXEC(N'ALTER TABLE [FactoryBills] DROP CONSTRAINT [' + @var5 + '];');
    ALTER TABLE [FactoryBills] ALTER COLUMN [ToDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var6 sysname;
    SELECT @var6 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[FactoryBills]') AND [c].[name] = N'FromDate');
    IF @var6 IS NOT NULL EXEC(N'ALTER TABLE [FactoryBills] DROP CONSTRAINT [' + @var6 + '];');
    ALTER TABLE [FactoryBills] ALTER COLUMN [FromDate] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [EmployeeWallets] ADD [CreatedAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var7 sysname;
    SELECT @var7 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Mobile2');
    IF @var7 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var7 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Mobile2] nvarchar(10) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var8 sysname;
    SELECT @var8 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Mobile1');
    IF @var8 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var8 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Mobile1] nvarchar(10) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var9 sysname;
    SELECT @var9 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'FactoryName');
    IF @var9 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var9 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [FactoryName] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [Employees] ADD [IsActive] bit NOT NULL DEFAULT CAST(0 AS bit);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [Employees] ADD [createdAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    DECLARE @var10 sysname;
    SELECT @var10 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Attendances]') AND [c].[name] = N'Date');
    IF @var10 IS NOT NULL EXEC(N'ALTER TABLE [Attendances] DROP CONSTRAINT [' + @var10 + '];');
    ALTER TABLE [Attendances] ALTER COLUMN [Date] date NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [Attendances] ADD [createdAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [AdvanceTransactions] ADD [CreatedAT] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    ALTER TABLE [AdminWallets] ADD [CreatedDate] datetime2 NOT NULL DEFAULT '0001-01-01T00:00:00.0000000';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250920191149_datetype_change'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250920191149_datetype_change', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250921094320_Requred_property_change'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250921094320_Requred_property_change', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var11 sysname;
    SELECT @var11 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Village');
    IF @var11 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var11 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Village] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var12 sysname;
    SELECT @var12 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Taluka');
    IF @var12 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var12 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Taluka] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var13 sysname;
    SELECT @var13 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'State');
    IF @var13 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var13 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [State] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var14 sysname;
    SELECT @var14 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Role');
    IF @var14 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var14 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Role] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var15 sysname;
    SELECT @var15 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'PanCard');
    IF @var15 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var15 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [PanCard] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var16 sysname;
    SELECT @var16 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Name');
    IF @var16 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var16 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Name] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var17 sysname;
    SELECT @var17 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'District');
    IF @var17 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var17 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [District] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var18 sysname;
    SELECT @var18 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Address');
    IF @var18 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var18 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Address] nvarchar(max) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    DECLARE @var19 sysname;
    SELECT @var19 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Attendances]') AND [c].[name] = N'Status');
    IF @var19 IS NOT NULL EXEC(N'ALTER TABLE [Attendances] DROP CONSTRAINT [' + @var19 + '];');
    ALTER TABLE [Attendances] ALTER COLUMN [Status] nvarchar(20) NOT NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    ALTER TABLE [Attendances] ADD [OT] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250922172025_OT_added'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250922172025_OT_added', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250923174339_payment_catagaory'
)
BEGIN
    ALTER TABLE [AdvanceTransactions] ADD [payment_catagaory] nvarchar(max) NOT NULL DEFAULT N'';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250923174339_payment_catagaory'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250923174339_payment_catagaory', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250927071841_Invice_added'
)
BEGIN
    CREATE TABLE [Invoices] (
        [InvoiceId] int NOT NULL IDENTITY,
        [CompanyName] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [GSTIN] nvarchar(max) NOT NULL,
        [PANNo] nvarchar(max) NOT NULL,
        [StateCode] nvarchar(max) NOT NULL,
        [State] nvarchar(max) NOT NULL,
        [InvoiceNo] nvarchar(max) NOT NULL,
        [InvoiceDate] datetime2 NOT NULL,
        [WorkOrderNo] nvarchar(max) NOT NULL,
        [WorkingPeriodFrom] datetime2 NOT NULL,
        [WorkingPeriodTo] datetime2 NOT NULL,
        [CustomerName] nvarchar(max) NOT NULL,
        [CustomerAddress] nvarchar(max) NOT NULL,
        [CustomerGSTIN] nvarchar(max) NOT NULL,
        [CustomerState] nvarchar(max) NOT NULL,
        [CustomerStateCode] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        [IGSTRate] decimal(18,2) NOT NULL,
        [CGSTRate] decimal(18,2) NOT NULL,
        [SGSTRate] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_Invoices] PRIMARY KEY ([InvoiceId])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250927071841_Invice_added'
)
BEGIN
    CREATE TABLE [InvoiceItems] (
        [InvoiceItemId] int NOT NULL IDENTITY,
        [InvoiceId] int NOT NULL,
        [SrNo] int NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ServiceCode] nvarchar(max) NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NOT NULL,
        [Rate] decimal(18,2) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        CONSTRAINT [PK_InvoiceItems] PRIMARY KEY ([InvoiceItemId]),
        CONSTRAINT [FK_InvoiceItems_Invoices_InvoiceId] FOREIGN KEY ([InvoiceId]) REFERENCES [Invoices] ([InvoiceId]) ON DELETE CASCADE
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250927071841_Invice_added'
)
BEGIN
    CREATE INDEX [IX_InvoiceItems_InvoiceId] ON [InvoiceItems] ([InvoiceId]);
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250927071841_Invice_added'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250927071841_Invice_added', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928053221_invice_update'
)
BEGIN
    EXEC sp_rename N'[Invoices].[CompanyName]', N'FactoryName', N'COLUMN';
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928053221_invice_update'
)
BEGIN
    ALTER TABLE [Invoices] ADD [Userid] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928053221_invice_update'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250928053221_invice_update', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928142330_invice_propertyadd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250928142330_invice_propertyadd', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928162210_factory_detailadd'
)
BEGIN
    CREATE TABLE [FactoryDetails] (
        [factorydetailsID] int NOT NULL IDENTITY,
        [Userid] int NOT NULL,
        [FactoryName] nvarchar(max) NOT NULL,
        [Address] nvarchar(max) NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [GSTIN] nvarchar(max) NOT NULL,
        [PANNo] nvarchar(max) NOT NULL,
        [StateCode] nvarchar(max) NOT NULL,
        [State] nvarchar(max) NOT NULL,
        [InvoiceNo] nvarchar(max) NOT NULL,
        [WorkOrderNo] nvarchar(max) NOT NULL,
        [CustomerName] nvarchar(max) NOT NULL,
        [CustomerAddress] nvarchar(max) NOT NULL,
        [CustomerGSTIN] nvarchar(max) NOT NULL,
        [CustomerState] nvarchar(max) NOT NULL,
        [CustomerStateCode] nvarchar(max) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_FactoryDetails] PRIMARY KEY ([factorydetailsID])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928162210_factory_detailadd'
)
BEGIN
    CREATE TABLE [InvoiceBilllistS] (
        [InvoiceBilllistid] int NOT NULL IDENTITY,
        [Userid] int NOT NULL,
        [SrNo] int NOT NULL,
        [Description] nvarchar(max) NOT NULL,
        [ServiceCode] nvarchar(max) NOT NULL,
        [Quantity] decimal(18,2) NOT NULL,
        [Unit] nvarchar(max) NOT NULL,
        [Rate] decimal(18,2) NOT NULL,
        [Amount] decimal(18,2) NOT NULL,
        [CreatedAt] datetime2 NOT NULL,
        CONSTRAINT [PK_InvoiceBilllistS] PRIMARY KEY ([InvoiceBilllistid])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20250928162210_factory_detailadd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20250928162210_factory_detailadd', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251001180624_image'
)
BEGIN
    CREATE TABLE [ImageRecords] (
        [Id] int NOT NULL IDENTITY,
        [FilePath] nvarchar(max) NOT NULL,
        CONSTRAINT [PK_ImageRecords] PRIMARY KEY ([Id])
    );
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251001180624_image'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251001180624_image', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251004034349_employee_imageadd'
)
BEGIN
    ALTER TABLE [Employees] ADD [ImagePath] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251004034349_employee_imageadd'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251004034349_employee_imageadd', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251004141418_OT_addedin_in_salary'
)
BEGIN
    ALTER TABLE [SalaryTransactions] ADD [TotalOTHours] int NOT NULL DEFAULT 0;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251004141418_OT_addedin_in_salary'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251004141418_OT_addedin_in_salary', N'8.0.10');
END;
GO

COMMIT;
GO

BEGIN TRANSACTION;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var20 sysname;
    SELECT @var20 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Village');
    IF @var20 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var20 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Village] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var21 sysname;
    SELECT @var21 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Taluka');
    IF @var21 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var21 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Taluka] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var22 sysname;
    SELECT @var22 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'State');
    IF @var22 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var22 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [State] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var23 sysname;
    SELECT @var23 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'PanCard');
    IF @var23 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var23 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [PanCard] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var24 sysname;
    SELECT @var24 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Mobile2');
    IF @var24 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var24 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Mobile2] nvarchar(10) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var25 sysname;
    SELECT @var25 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'District');
    IF @var25 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var25 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [District] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    DECLARE @var26 sysname;
    SELECT @var26 = [d].[name]
    FROM [sys].[default_constraints] [d]
    INNER JOIN [sys].[columns] [c] ON [d].[parent_column_id] = [c].[column_id] AND [d].[parent_object_id] = [c].[object_id]
    WHERE ([d].[parent_object_id] = OBJECT_ID(N'[Employees]') AND [c].[name] = N'Address');
    IF @var26 IS NOT NULL EXEC(N'ALTER TABLE [Employees] DROP CONSTRAINT [' + @var26 + '];');
    ALTER TABLE [Employees] ALTER COLUMN [Address] nvarchar(max) NULL;
END;
GO

IF NOT EXISTS (
    SELECT * FROM [__EFMigrationsHistory]
    WHERE [MigrationId] = N'20251005110645_nothing'
)
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES (N'20251005110645_nothing', N'8.0.10');
END;
GO

COMMIT;
GO

