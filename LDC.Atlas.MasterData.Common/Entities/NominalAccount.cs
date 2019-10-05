using LDC.Atlas.DataAccess.DapperMapper;
using System;

namespace LDC.Atlas.MasterData.Common.Entities
{
    public class NominalAccount
    {
        [Column(Name = "NominalAccountCode")]
        public string NominalAccountNumber { get; set; }

        public string NominalAccountNumberFormated { get; set; }

        public string ShortDescription { get; set; }

        public string DetailedDescription { get; set; }

        public DateTime CreatedDateTime { get; set; }

        public string CreatedBy { get; set; }

        public DateTime ModifiedDateTime { get; set; }

        public string ModifiedBy { get; set; }

        public int NominalAccountId { get; set; }

        public string DetailAccountTitle { get; set; }

        public bool BankAccount { get; set; }

        public string AlternativeDescription { get; set; }

        public int ClientAccountMandatory { get; set; }

        public string AccountType { get; set; }
    }
}
