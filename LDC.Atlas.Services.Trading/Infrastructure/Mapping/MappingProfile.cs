using LDC.Atlas.Application.Common.Configuration.Dto;
using LDC.Atlas.DataAccess.Dynamic;
using LDC.Atlas.Infrastructure.ViewModel;
using LDC.Atlas.Services.Trading.Application.Commands;
using LDC.Atlas.Services.Trading.Application.Commands.CreateFxDeal;
using LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDeal;
using LDC.Atlas.Services.Trading.Entities;

namespace LDC.Atlas.Services.Trading.Infrastructure.Mapping
{
    // http://docs.automapper.org/en/stable/Configuration.html
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            // Map internal properties
            // https://stackoverflow.com/a/37397851
            ShouldMapProperty = p => p.GetMethod.IsPublic || p.GetMethod.IsAssembly;

            CreateMap<UpdatePhysicalContractCommand, Section>();
            CreateMap<CreatePhysicalFixedPricedContractCommand, Section>();
            CreateMap<CreateTrancheCommand, SectionDeprecated>();
            CreateMap<CreateSplitCommand, SectionDeprecated>();
            CreateMap<CreateFavouriteCommand, TradeFavoriteDetail>();

            CreateMap<CreateCostMatrixCommand, CostMatrix>();
            CreateMap<CreateCostMatrixWithParametersCommand, CostMatrix>();
            CreateMap<UpdateCostMatrixCommand, CostMatrix>();
            CreateMap<UpdateCostMatrixWithParametersCommand, CostMatrix>();

            CreateMap<EntitySearchRequest, DynamicQueryDefinition>();
            CreateMap<GridColumnDto, ColumnConfiguration>();

            CreateMap<PhysicalTradeBulkEditCommand, PhysicalTradeBulkEdit>();

            CreateMap<CreateFxDealCommand, FxDeal>();
            CreateMap<UpdateFxDealCommand, FxDeal>();

            CreateMap<Application.Commands.UpdateFxDeal.FxDealSection, Entities.FxDealSection>();

        }
    }
}
