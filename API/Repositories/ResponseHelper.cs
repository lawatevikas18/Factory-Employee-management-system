using Auth.Api.Models;

namespace Auth.Api.Repositories
{
    public static class ResponseHelper
    {
        public static ApiResponse<T> Success<T>(T data, string msg = "success")
        {
            return new ApiResponse<T>
            {
                StatusCode = 200,
                JsonStr = data,
                Msg = msg,
                Remark = ""
            };
        }

        public static ApiResponse<T> Fail<T>(string remark, int code = 400)
        {
            return new ApiResponse<T>
            {
                StatusCode = code,
                JsonStr = default,
                Msg = "failed",
                Remark = remark
            };
        }
    }

}
