using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.MasterData.Entities
{
    public class CompanyBankAccount
    {
        public long BankAccountId { get; set; }

        public string BankName { get; set; }

        public long BankCountryKey { get; set; }

        public string AccountNo { get; set; }

        public string AccountCCY { get; set; }

        public short BankTypeID { get; set; }

        public short BankAccountStatusID { get; set; }

        public short BankAccountDefault { get; set; }
    }
}
