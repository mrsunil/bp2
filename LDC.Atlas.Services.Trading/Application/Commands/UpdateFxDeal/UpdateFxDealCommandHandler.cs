using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.MasterData.Common;
using LDC.Atlas.Services.Trading.Application.Queries;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands.UpdateFxDeal
{
    public class UpdateFxDealCommandHandler : IRequestHandler<UpdateFxDealCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFxDealRepository _fxDealRepository;
        private readonly IMapper _mapper;
        private readonly IMasterDataService _masterDataService;
        private readonly IUserService _userService;
        private readonly IFxDealQueries _fxDealQueries;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IIdentityService _identityService;

        public UpdateFxDealCommandHandler(
            ILogger<UpdateFxDealCommandHandler> logger,
            IUnitOfWork unitOfWork,
            IFxDealRepository fxDealRepository,
            IMapper mapper,
            IMasterDataService masterDataService,
            IIdentityService identityService,
            ISystemDateTimeService systemDateTimeService,
            IUserService userService,
            IFxDealQueries fxDealQueries)
        {
            _fxDealRepository = fxDealRepository ?? throw new ArgumentNullException(nameof(fxDealRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _masterDataService = masterDataService ?? throw new ArgumentNullException(nameof(masterDataService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _userService = userService ?? throw new ArgumentNullException(nameof(userService));
            _fxDealQueries = fxDealQueries ?? throw new ArgumentNullException(nameof(fxDealQueries));
        }

        public async Task<Unit> Handle(UpdateFxDealCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var fxDealToUpdate = _mapper.Map<FxDeal>(request);
                var company = await _masterDataService.GetCompanyByIdAsync(request.CompanyId);

                if(company.IsProvinceEnable)
                {
                    fxDealToUpdate.ProvinceId = company.DefaultProvinceId;
                    fxDealToUpdate.BranchId = company.DefaultBranchId;
                }
                else
                {
                    fxDealToUpdate.ProvinceId = null;
                    fxDealToUpdate.BranchId = null;
                }

                IEnumerable<MasterData.Common.Entities.FxTradeType> fxTradeType = await _masterDataService.GetFxTradeTypes(fxDealToUpdate.CompanyId);

                if (fxDealToUpdate.FxTradeTypeId != null)
                {
                    var objectFxTradeType = fxTradeType.FirstOrDefault(x => x.FxTradeTypeId == fxDealToUpdate.FxTradeTypeId);

                    if (!objectFxTradeType.IsNdf)
                    {
                        fxDealToUpdate.NdfAgreedDate = null;
                        fxDealToUpdate.NdfAgreedRate = null;
                    }
                }
                else
                {
                    fxDealToUpdate.NdfAgreedDate = null;
                    fxDealToUpdate.NdfAgreedRate = null;
                }


                // Load fx deal from DB
                var fxDealDto = await _fxDealQueries.GetFxDealByIdAsync(request.FxDealId, request.CompanyId);

                if (fxDealDto == null)
                {
                    throw new NotFoundException("fxDeal", request.FxDealId);
                }

                // Check fx deal status
                //if (fxDealDto.FxDealStatusId != (int)FxDealStatus.Open || fxDealDto.Sections.Any())
                //{
                //    throw new AtlasBusinessException("This Fx deal is not editable.");
                //}

                if (fxDealDto.FxDealStatusId != (int)FxDealStatus.Open && fxDealDto.FxDealStatusId != (int)FxDealStatus.Linked)
                {
                    throw new AtlasBusinessException("This Fx deal is not editable.");
                }

                // Update fx deal (only when status is open)
                if (fxDealDto.FxDealStatusId == (int)FxDealStatus.Open)
                {
                    // Validate business rules
                    //await FxDealCommonRules.ValidateFxDeal(fxDealToUpdate, _identityService, _masterDataService, _userService, _systemDateTimeService);

                    fxDealToUpdate.FxDealStatusId = fxDealDto.FxDealStatusId;
                    if (fxDealDto.Sections.Any() || fxDealToUpdate.Sections.Any())
                    {
                        fxDealToUpdate.FxDealStatusId = (int)FxDealStatus.Linked;
                    }

                    await _fxDealRepository.UpdateFxDealAsync(fxDealToUpdate, request.CompanyId);
                }

                // Update associated sections
                if (fxDealToUpdate.Sections.Any())
                {
                    // Match existing section with updated ones
                    var matchedSections =
                    (from ori in fxDealDto.Sections
                     join upd in fxDealToUpdate.Sections on ori.SectionId equals upd.SectionId into updatedSections
                     from s in updatedSections
                     select new
                     {
                         OriginalSection = ori,
                         UpdatedSection = s,
                     }).ToList();

                    // Update existing section with new values
                    foreach (var item in matchedSections)
                    {
                        item.UpdatedSection.UncoveredAmount = item.OriginalSection.UncoveredAmount;
                        //fxDealToUpdate.Sections.Add(new Entities.FxDealSection
                        //{
                        //    SectionId = item.OriginalSection.SectionId,
                        //    CoverApplied = item.UpdatedSection.CoverApplied,
                        //    UncoveredAmount = item.OriginalSection.UncoveredAmount
                        //});

                        //item.OriginalSection.CoverApplied = item.UpdatedSection.CoverApplied;
                    }

                    // List of sections added (sections from request that do not match existing ones)
                    var addedSections = fxDealToUpdate.Sections.Except(matchedSections.Select(s => s.UpdatedSection)).ToList();

                    // If new sections have been added
                    if (addedSections.Any())
                    {
                        // Load information about the new sections
                        var sectionInfo = await _fxDealRepository.GetSectionInformationForFxDealAsync(addedSections.Select(s => s.SectionId), request.CompanyId);

                        // Check if new sections can be associated to the fx deal (same currency, same department)
                        if (sectionInfo.Any(s => s.CurrencyCode != fxDealToUpdate.CurrencyCode))
                        {
                            throw new AtlasBusinessException($"The associated sections must have the same currency as the fx deal ({fxDealToUpdate.CurrencyCode}).");
                        }

                        if (sectionInfo.Any(s => s.DepartmentId != fxDealToUpdate.DepartmentId))
                        {
                            throw new AtlasBusinessException($"The associated sections must have the same department as the fx deal.");
                        }

                        // Match added section with information from DB
                        var matchedAddedSections =
                            (from a in addedSections
                             join s in sectionInfo on a.SectionId equals s.SectionId into sectionsInfo
                             from si in sectionsInfo.DefaultIfEmpty() // DefaultIfEmpty preserves left-hand elements that have no matches on the right side  
                             select new
                             {
                                 AddedSection = a,
                                 SectionInformation = si,
                             }).ToList();

                        // Associate the new sections to fx deal
                        foreach (var item in matchedAddedSections)
                        {
                            if (item.SectionInformation == null)
                            {
                                throw new AtlasBusinessException($"Cannot found section {item.AddedSection.SectionId}.");
                            }

                            item.AddedSection.UncoveredAmount = item.SectionInformation.UncoveredAmount;
                        }
                    }

                    // A control must be applied on the "Cover applied" field to prevent the user to enter a value higher than “Amount uncovered” field’s value.
                    foreach (var section in fxDealToUpdate.Sections)
                    {
                        if (section.CoverApplied > section.UncoveredAmount)
                        {
                            throw new AtlasBusinessException($"The cover applied ({section.CoverApplied}) of the physical trade {section.SectionId} cannot be greather that the amount uncovered ({section.UncoveredAmount}).");
                        }
                    }

                    // CoverApplied of existing sections (after update)
                    var allCoverApplied =
                        (from a in fxDealDto.Sections
                         join b in fxDealToUpdate.Sections on a.SectionId equals b.SectionId into su
                         from s in su.DefaultIfEmpty() // DefaultIfEmpty preserves left-hand elements that have no matches on the right side  
                         select s?.CoverApplied ?? a.CoverApplied).ToList();

                    // Sum of the cover applied of all associated sections (after update)
                    var totalCoverApplied = addedSections.Sum(s => s.CoverApplied) + allCoverApplied.Sum();
                    if (fxDealToUpdate.Amount < totalCoverApplied)
                    {
                        throw new AtlasBusinessException($"The sum of the amount of the physical trade covered by the FX deal ({totalCoverApplied}) cannot be greather that the dealt amount ({fxDealToUpdate.Amount}).");
                    }

                    await _fxDealRepository.UpdateFxDealSectionsAsync(fxDealDto.FxDealId, fxDealToUpdate.Sections, request.CompanyId);
                }

                _logger.LogInformation("Fx deal with id {Atlas_FxDealId} updated.", fxDealToUpdate.FxDealId);

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
