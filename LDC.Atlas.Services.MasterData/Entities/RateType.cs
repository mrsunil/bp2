using LDC.Atlas.DataAccess.DapperMapper;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class RateType
    {
        public int RateTypeId { get; set; }

        [Column(Name = "RateType")]
        public string RateTypeCode { get; set; }
    }
}
