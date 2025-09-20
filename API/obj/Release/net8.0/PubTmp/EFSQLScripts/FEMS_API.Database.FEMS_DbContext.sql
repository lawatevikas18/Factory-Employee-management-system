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

