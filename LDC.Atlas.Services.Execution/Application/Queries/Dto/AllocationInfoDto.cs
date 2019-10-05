using System;

namespace LDC.Atlas.Services.Execution.Application.Queries.Dto
{
    public class AllocationInfoDto
    {
        public DateTime DateOfAllocation { get; set; }

        public int AllocatedSectionId { get; set; }

        public int GroupNumber { get; set; }

        public string ContractTermCode { get; set; }

        public string AllocatedSectionCode { get; set; }

        public string BuyerCode { get; set; }

        public string SellerCode { get; set; }

        public int TransferShippingOptionId { get; set; }
    }
}
