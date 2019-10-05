using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.Services.Document.Application.Queries.Dto
{
    public class ContractAdviceInfoDto
    {
        public long PhysicalContractId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string ContractLabel { get; set; }

        [Column(Name = "Type")]
        public ContractTypeDto ContractType { get; set; }

        public long SectionId { get; set; }

        [Column(Name = "PhysicalContractId")]
        public long ContractId { get; set; }

        [Column(Name = "SectionNumberId")]
        public string SectionNumber { get; set; }

        public long DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        [Column(Name = "Counterparty")]
        public string CounterpartyReference { get; set; }
    }
}
