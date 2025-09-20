namespace FEMS_API.DTOS
{
      public class UserRegisterDto
         {
            public int AdminId { get; set; }
            public string Name { get; set; }
            public string Address { get; set; }
            public string Aadhaar { get; set; }
            public string PanCard { get; set; }
            public string MobileNumber { get; set; }
            public string Role { get; set; }
            public string FactoryName { get; set; }
            public string Password { get; set; }
        }

}
