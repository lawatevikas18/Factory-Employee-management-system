namespace Auth.Api.Models
{
    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public T JsonStr { get; set; }
        public string Msg { get; set; }
        public string Remark { get; set; }
    }
}
