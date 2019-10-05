using LDC.Atlas.Application.Core.Entities;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.Services;
using LDC.Atlas.Services.Execution.Entities;
using LDC.Atlas.Services.Execution.Infrastructure.Policies;
using LDC.Atlas.Services.Execution.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Execution.Application.Commands
{
    public class CharterCommandsHandler :
        IRequestHandler<CreateCharterCommand, CharterReference>,
        IRequestHandler<UpdateCharterCommand>,
        IRequestHandler<AssignSectionsToCharterCommand>,
        IRequestHandler<RemoveSectionsFromCharterCommand>,
        IRequestHandler<ReassignSectionsForCharterCommand>,
        IRequestHandler<DeleteCharterCommand>,
        IRequestHandler<UpdateSectionTrafficCommand>,
        IRequestHandler<CloseCharterCommand>,
        IRequestHandler<ReopenCharterCommand>
    {
        private readonly ILogger<CharterCommandsHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICharterRepository _charterRepository;
        private readonly IFreezeRepository _freezeRepository;
        private readonly ISystemDateTimeService _systemDateTimeService;
        private readonly IProcessMessageService _processMessageService;
        private readonly IAuthorizationService _authorizationService;

        public CharterCommandsHandler(
            ILogger<CharterCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            ICharterRepository charterRepository,
            IFreezeRepository freezeRepository,
            ISystemDateTimeService systemDateTimeService,
            IProcessMessageService processMessageService,
            IAuthorizationService authorizationService)
        {
            _charterRepository = charterRepository ?? throw new ArgumentNullException(nameof(charterRepository));
            _freezeRepository = freezeRepository ?? throw new ArgumentNullException(nameof(freezeRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _systemDateTimeService = systemDateTimeService ?? throw new ArgumentNullException(nameof(systemDateTimeService));
            _processMessageService = processMessageService ?? throw new ArgumentNullException(nameof(processMessageService));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
        }

        public async Task<CharterReference> Handle(CreateCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var charter = ConvertToCharter(request);

                var newCharterId = await _charterRepository.AddCharterAsync(charter, request.Company);

                _unitOfWork.Commit();

                _logger.LogInformation("New charter created with id {Atlas_CharterId}.", newCharterId);

                return new CharterReference { CharterId = newCharterId, CharterCode = charter.CharterCode };
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var charter = ConvertToCharter(request);

                if (!request.IsDeassignSectionRequest)
                {
                    await _charterRepository.UpdateCharterAsync(charter, request.Company);
                }

                var sectionsAssignedCount = charter.SectionsAssigned.ToList().Count;

                if (sectionsAssignedCount > 0)
                {
                    await _charterRepository.UpdateSectionTrafficAsync(charter, request.Company, request.IsDeassignSectionRequest);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Charter with id {Atlas_CharterId} updated.", request.CharterId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(AssignSectionsToCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var sectionsId = request.SectionsTraffic.Select(section => section.SectionId).ToList();

                await _charterRepository.AssignSectionsToCharterAsync(request.CharterId, sectionsId, request.Company);

                if (sectionsId.Any())
                {
                    await _charterRepository.UpdateVesselInformationAsync(request.SectionsTraffic, request.Company);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Sections added to charter with id {Atlas_CharterId}.", request.CharterId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(RemoveSectionsFromCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _charterRepository.RemoveSectionsFromCharterAsync(request.CharterId, request.SectionIds, request.Company);

                _unitOfWork.Commit();

                _logger.LogInformation("Section removed from charter with id {Atlas_CharterId}.", request.CharterId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(ReassignSectionsForCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var sectionsIds = request.SectionsAssigned.Select(section => long.Parse(section.SectionId, CultureInfo.InvariantCulture)).ToList();
                await _charterRepository.RemoveSectionsFromCharterAsync(request.CharterId, sectionsIds, request.Company);

                await _charterRepository.AssignSectionsToCharterAsync(request.NewCharterId, sectionsIds, request.Company);

                List<SectionTraffic> sectionTrafficList = new List<SectionTraffic>();

                foreach (var section in request.SectionsAssigned)
                {
                    SectionTraffic sectionTraffic = new SectionTraffic();
                    sectionTraffic.SectionId = long.Parse(section.SectionId, CultureInfo.InvariantCulture);
                    sectionTraffic.VesselCode = request.NewCharterVesselCode;
                    if (section.RemoveSectionTrafficInfo != null && section.RemoveSectionTrafficInfo == true)
                    {
                        sectionTraffic.BLDate = (DateTime?)null;
                        sectionTraffic.BLReference = null;
                    }
                    else
                    {
                        sectionTraffic.BLDate = section.BlDate;
                        sectionTraffic.BLReference = section.BLRef;
                    }

                    sectionTrafficList.Add(sectionTraffic);
                }

                if (sectionsIds.Any())
                {
                    await _charterRepository.UpdateVesselInformationAsync(sectionTrafficList, request.Company);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Section re-assigned from charter with id {Atlas.CharterId} to {Atlas.newCharterId} ", request.CharterId, request.NewCharterId);

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Commit();
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteCharterCommand request, CancellationToken cancellationToken)
        {
            var sectionsAssignedToCharter = await _charterRepository.GetSectionsAssignedToCharter(request.CharterId, request.Company);

            if (sectionsAssignedToCharter != null)
            {
                _unitOfWork.Rollback();
                throw new AtlasBusinessException($"Cannot delete charter with id {request.CharterId} as it has contracts assigned to it.");
            }

            _unitOfWork.BeginTransaction();

            try
            {
                await _charterRepository.DeleteCharterAsync(request.Company, request.CharterId);

                _unitOfWork.Commit();

                _logger.LogInformation("Charter with id {Atlas_CharterId} deleted.", request.CharterId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(UpdateSectionTrafficCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var sectionTraffic = ConvertToSectionTraffic(request);

                var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), sectionTraffic, Policies.CharterPolicy);
                var vesselNamePolicyResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), sectionTraffic, Policies.VesselNamePolicy);
                var blDatePolicyResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), sectionTraffic, Policies.BlDatePolicy);
                var blReferencePolicyResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), sectionTraffic, Policies.BlReferencePolicy);
                var quantityForTrafficPolicyResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), sectionTraffic, Policies.QuantityForTrafficPolicy);

                if (authorizationResult.Succeeded || vesselNamePolicyResult.Succeeded || blDatePolicyResult.Succeeded || blReferencePolicyResult.Succeeded || quantityForTrafficPolicyResult.Succeeded)
                {
                    if (request.DataVersionId != null)
                    {
                        var freezeDate = await _freezeRepository.GetFreezeNotClosedAsync(request.CompanyId, request.DataVersionId.Value);

                        if (freezeDate == null)
                        {
                            throw new AtlasBusinessException($"Contracts cannot be updated in a freeze if the month is closed.");
                        }
                    }

                    var companyDate = await _systemDateTimeService.GetCompanyDate(request.CompanyId);

                    if (request.BLDate != null && request.BLDate.Value.Date > companyDate.Date)
                    {
                        throw new AtlasBusinessException($"BL Date cannot be in the future. Bl Date: {request.BLDate.Value.Date}. Company date: {companyDate}.");
                    }

                    await _charterRepository.UpdateSectionTrafficDetailsAsync(sectionTraffic, request.CompanyId, request.DataVersionId);

                    if (request.DataVersionId != null)
                    {
                        await InsertFreezeRecalcProcessQueue(request.SectionId, request.DataVersionId, request.CompanyId);
                    }

                    _unitOfWork.Commit();

                    _logger.LogInformation("Section Traffic with id {Atlas_SectionId} updated.", request.SectionId);
                }
                else
                {
                    throw new AtlasSecurityException("One or more privileges are required to perform this action.");
                }

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(CloseCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _charterRepository.UpdateCharterStatusAsync(request.Company, request.CharterIds, (int)CharterStatus.Closed, request.DataVersionid);

                _unitOfWork.Commit();

                _logger.LogInformation("Charter with id {Atlas_CharterId} closed.", request.CharterIds);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(ReopenCharterCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                await _charterRepository.UpdateCharterStatusAsync(request.Company, request.CharterIds, (int)CharterStatus.Open, request.DataVersionid);

                _unitOfWork.Commit();

                _logger.LogInformation("Charter with id {Atlas_CharterId} closed.", request.CharterIds);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        private static Charter ConvertToCharter(CreateCharterCommand command)
        {
            return new Charter
            {
                CharterCode = command.Reference,
                Description = command.Description,
                VesselId = command.VesselId,
                TransportTypeCode = command.TransportType,
                LoadingLocationCode = command.LoadingLocation,
                DepartureDate = command.DepartureDate,
                DischargeLocationCode = command.DischargeLocation,
                ArrivalDate = command.ArrivalDate,
                SectionsAssigned = command.SectionsAssigned ?? new List<SectionsAssignedToCharterRecord>(),
                CharterManagerId = command.CharterManagerId,
                Memo = command.Memo,
                BlDate = command.BlDate,
                Currency = command.Currency,
                DepartmentId = command.DepartmentId,
                BLRef = command.BLRef,
                WeightUnitId = command.WeightUnitId
            };
        }

        private static Charter ConvertToCharter(UpdateCharterCommand command)
        {
            return new Charter
            {
                CharterId = command.CharterId,
                CharterCode = command.Reference,
                Description = command.Description,
                VesselId = command.VesselId,
                VesselCode = command.Vessel,
                TransportTypeCode = command.TransportType,
                LoadingLocationCode = command.LoadingLocation,
                DepartureDate = command.DepartureDate,
                DischargeLocationCode = command.DischargeLocation,
                ArrivalDate = command.ArrivalDate,
                SectionsAssigned = command.SectionsAssigned ?? new List<SectionsAssignedToCharterRecord>(),
                CharterManagerId = command.CharterManagerId == 0 ? (long?)null : command.CharterManagerId,
                Memo = command.Memo,
                BlDate = command.BlDate,
                Currency = command.Currency,
                DepartmentId = command.DepartmentId,
                BLRef = command.BLRef,
                WeightUnitId = command.WeightUnitId
            };
        }

        private static SectionTraffic ConvertToSectionTraffic(UpdateSectionTrafficCommand command)
        {
            return new SectionTraffic
            {
                SectionId = command.SectionId,
                DataVersionId = command.DataVersionId,
                BLDate = command.BLDate,
                BLReference = command.BLReference,
                VesselCode = string.IsNullOrEmpty(command.VesselCode) ? null : command.VesselCode,
                ShippingStatusCode = string.IsNullOrEmpty(command.ShippingStatusCode) ? null : command.ShippingStatusCode,
            };
        }

        /// <summary>
        /// This method will insert record into Process message to call the recalc
        /// </summary>
        /// <param name="sectionId"> section command object</param>
        /// <param name="dataVersionId">dataversion being edited</param>
        /// <param name="companyId">company on which there is edition</param>
        private async Task InsertFreezeRecalcProcessQueue(long sectionId, long? dataVersionId, string companyId)
        {
            dynamic message = new JObject(
               new JProperty("userId", _identityService.GetUserName()),
               new JProperty("sectionId", sectionId),
               new JProperty("dataVersionId", dataVersionId));

            await _processMessageService.SendMessage(new ProcessMessage
            {
                ProcessTypeId = (int)ProcessType.AtlasRecalculationProcessor,
                CompanyId = companyId,
                Content = message.ToString()
            });
        }
    }
}
