using LDC.Atlas.Application.Core.Entities;
using System;

namespace LDC.Atlas.Services.Reporting.Application.Queries.Dto
{
    public class ReferentialBulkEditDto : PaginatedItem
    {
        public long CounterpartyID { get; set; }

        public long AddressId { get; set; }

        public int TradeStatusId { get; set; }

        public bool StatusId { get; set; }

        public string AccountReference { get; set; }

        public string AccountTitle { get; set; }

        public string Address1 { get; set; }

        public string Address2 { get; set; }

        public string Main { get; set; }

        public string City { get; set; }

        public string Country { get; set; }

        public string MailEmailAddress { get; set; }

        public string ZipCode { get; set; }

        public int LdcRegion { get; set; }

        public string Province { get; set; }

        public string AddressType { get; set; }

        public string HeadOfFamily { get; set; }

        public string CompanyId { get; set; }

        public int MdmId { get; set; }
        
        public int MDMCategoryId { get; set; }

        public DateTime CreatedOn { get; set; }

        public string CreatedBy { get; set; }

        public string GroupAC { get; set; }

        public string C2CReference { get; set; }

        public DateTime DateAmended { get; set; }

        public string AmendedBy { get; set; }

    }
}
