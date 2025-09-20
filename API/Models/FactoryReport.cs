using System.ComponentModel.DataAnnotations;

namespace FEMS_API.Models
{
    public class FactoryReport
    {
        [Key]
        public int Id { get; set; }  // अ. क्र .

        [Required]
        public string FactoryName { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public DateTime StartDate { get; set; }  // रिपोर्ट सुरू होण्याची तारीख

        [Required]
        public DateTime EndDate { get; set; }  // रिपोर्ट संपण्याची तारीख

        public DateTime CreatedDate { get; set; } = DateTime.Now;  // रिपोर्ट तयार झाल्याची तारीख (Default: Now)

        public decimal SugarPacking50Kg { get; set; }  // शुगर पॅकिंग ५० kg मध्ये
        public decimal HamalKamgarPagar { get; set; }  // हमाल कामगार पगार
        public decimal SugarHouseSilaiKamgarPagar { get; set; }  // शुगर हाऊस व शिलाई कामगार पगार
        public decimal TotalKamgarPagar { get; set; }  // हमाल व शुगर हाऊस शिलाई कामगार एकुण पगार

        public int VarniMukadamSankhya { get; set; }  // वारणी मुकादम संख्या
        public decimal MukadamVarniCharge { get; set; }  // मुकादम वारणी चार्ज
        public decimal MukadamVarniRakkam { get; set; }  // मुकादम वारणी रक्कम

        public int RackVarniMukadamSankhya { get; set; }  // रॅक वारणी मुकादम संख्या
        public decimal RackMukadamVarniCharge { get; set; }  // रॅक मुकादम वारणी चार्ज
        public decimal RackVarniTotalRakkam { get; set; }  // रॅक वारणी एकुण रक्कम

        public decimal TotalLoadingTonnage { get; set; }  // एकुण लोडिनग टनेज
        public decimal TonnageCharge { get; set; }  // टनेज चार्ज
        public decimal TotalTonnageRakkam { get; set; }  // एकुण टनेज रक्कम

        public int TotalAssamHamal { get; set; }  // एकुण आसाम हमाल
        public decimal AssamHamalCharges { get; set; }  // आसाम हमाल चार्जेस
        public decimal TotalAssamVarniRakkam { get; set; }  // एकुण आसाम वारणी रक्कम

        public decimal FinalTotal { get; set; }  // मुकादम वारणी / रॅक/ एकुण टनेज रक्कम
    }
}
