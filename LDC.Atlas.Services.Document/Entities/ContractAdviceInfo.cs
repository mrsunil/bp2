using LDC.Atlas.DataAccess.DapperMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Document.Entities
{
    public class ContractAdviceInfo
    {
        public long PhysicalContractId { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public string ContractLabel { get; set; }

        public ContractType Type { get; set; }

        public long SectionId { get; set; }

        public string SectionNumberId { get; set; }

        public long DepartmentId { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public string Counterparty { get; set; }
    }
}
