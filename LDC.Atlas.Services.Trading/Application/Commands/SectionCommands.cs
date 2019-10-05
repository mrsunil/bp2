using LDC.Atlas.Document.Common.Dtos;
using LDC.Atlas.Services.Trading.Entities;
using MediatR;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class ApproveSectionCommand : IRequest
    {
        public string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class UnapproveSectionCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class DeleteSectionCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class CloseSectionStatusCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long[] SectionIds { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }
    }

    public class OpenSectionStatusCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long[] SectionIds { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }
    }

    public class CancelSectionStatusCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public long[] SectionIds { get; set; } // internal to avoid the exposure in Swagger

        public DateTime BlDate { get; set; }
    }

    public class ReverseCancelSectionStatusCommand : IRequest
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long[] SectionIds { get; set; } // internal to avoid the exposure in Swagger
    }

    public class AssignContractAdviceCommand : IRequest<PhysicalDocumentReferenceDto>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

        [Range(1, long.MaxValue)]
        public long DocumentId { get; set; }

        public string DocumentTemplatePath { get; set; }
    }

    public class GenerateContractAdviceCommand : IRequest<PhysicalDocumentReferenceDto>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

        public string DocumentTemplatePath { get; set; }
    }

    public class UpdateContractAdviceCommand : IRequest<PhysicalDocumentReferenceDto>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

        [Range(1, long.MaxValue)]
        public long DraftDocumentId { get; set; }

        [Range(1, long.MaxValue)]
        public long PhysicalDocumentId { get; set; }

        public string DocumentTemplatePath { get; set; }
    }

    public class DeleteCostsCommand : IRequest
    {
        internal string Company { get; set; }

        internal long SectionId { get; set; }

        public IEnumerable<long> CostIds { get; set; }

        public long? DataVersionId { get; set; }
    }

    public class SplitSectionCommand : IRequest
    {
        internal string Company { get; set; }

        public IEnumerable<ChildSectionsToSplitCommand> ChildSections { get; set; }

        public long SectionOriginId { get; set; }
    }

    public class ChildSectionsToSplitCommand
    {
        public long ChildSectionId { get; set; }

        public decimal SplitQuantity { get; set; }
    }

    public class UpdateBulkApprovalCommand : IRequest
    {
        internal string CompanyId { get; set; }// internal to avoid the exposure in Swagger

        public long[] SectionIds { get; set; }

        public long? DataVersionId { get; set; }
    }

    public class DeleteTradeFavoriteCommand : IRequest
    {
        internal long TradeFavoriteId { get; set; } // internal to avoid the exposure in Swagger
    }

    public class CreateFavouriteCommand : IRequest<long>
    {
        public string Name { get; set; }

        public string Description { get; set; }

        public long SectionId { get; set; }

        public TradeFavoriteDetail TradeFavoriteToBeCreated { get; set; }

        internal string CompanyId { get; set; }// internal to avoid the exposure in Swagger
    }

    public class CreateManualIntercoCommand : IRequest<IEnumerable<SectionReference>>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

        public long? DataVersionId { get; set; }

        public bool IsInterco { get; set; }

        public ContractType IntercoContractType { get; set; }

        public string IntercoCompanyId { get; set; } // internal to avoid the exposure in Swagger

        public string IntercoBuyerCode { get; set; }

        public string IntercoSellerCode { get; set; }

        public long? IntercoDepartmentId { get; set; }

        public long? IntercoTraderId { get; set; }

        public bool IsRemoveInterco { get; set; }
    }

    public class SaveBulkCostsCommand : IRequest<IEnumerable<CostBulkEdit>>
    {
        internal string Company { get; set; } // internal to avoid the exposure in Swagger

        public IEnumerable<CostBulkEdit> Costs { get; set; }

        public long? DataVersionId { get; set; }

    }

    //public class CreateTrancheCommand : IRequest<IEnumerable<SectionReference>>
    //{
    //    internal string Company { get; set; } // internal to avoid the exposure in Swagger

    //    internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

    //    public IEnumerable<TrancheSplitSection> Sections { get; set; }
    //}

    //public class CreateSplitCommand : IRequest<IEnumerable<SectionReference>>
    //{
    //    internal string Company { get; set; } // internal to avoid the exposure in Swagger

    //    internal long SectionId { get; set; } // internal to avoid the exposure in Swagger

    //    public IEnumerable<TrancheSplitSection> Sections { get; set; }
    //}

    //public class TrancheSplitSection
    //{
    //    public decimal Quantity { get; set; }

    //    public string SectionNumber { get; set; }
    //}
}
