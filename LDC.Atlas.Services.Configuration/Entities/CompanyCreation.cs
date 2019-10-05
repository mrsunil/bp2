using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Entities
{
    public class CompanyCreation
    {
        public string CompanyId { get; set; }

        public string CompanyToCopy { get; set; }

        public bool IsCounterpartyRequired { get; set; }

        public bool IsTransactionDataSelected { get; set; }

        public IEnumerable<CompanyUserProfile> CompanyUserProfile { get; set; }

        public CompanyConfiguration CompanyConfiguration { get; set; }
    }
}
