using System.Data;
using Microsoft.Data.SqlClient;

public interface IDbConnectionFactory
{
    IDbConnection CreateConnection();
}

public class DbConnectionFactory : IDbConnectionFactory
{
    private readonly IConfiguration _config;
    public DbConnectionFactory(IConfiguration config) => _config = config;

    public IDbConnection CreateConnection() =>
        new SqlConnection(_config.GetConnectionString("Default"));
}
