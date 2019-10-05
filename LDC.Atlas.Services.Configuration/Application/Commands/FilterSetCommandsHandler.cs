using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using static LDC.Atlas.Services.Configuration.Infrastructure.Policies.AuthorizationPoliciesExtension;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class FilterSetCommandsHandler : IRequestHandler<CreateFilterSetCommand, int>,
        IRequestHandler<UpdateFilterSetCommand>,
        IRequestHandler<DeleteFilterSetCommand>,
        IRequestHandler<CreateFavoriteFilterSetCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFilterSetRepository _filterSetRepository;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IIdentityService _identityService;

        public FilterSetCommandsHandler(
            ILogger<FilterSetCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IFilterSetRepository filterSetRepository,
            IMapper mapper,
            IAuthorizationService authorizationService,
            IIdentityService identityService)
        {
            _filterSetRepository = filterSetRepository ?? throw new ArgumentNullException(nameof(filterSetRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }

        public async Task<int> Handle(CreateFilterSetCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var filterSet = _mapper.Map<FilterSet>(request);

                var filterSetId = await _filterSetRepository.CreateFilterSetAsync(filterSet);

                _unitOfWork.Commit();

                _logger.LogInformation("New filter set created with id {Atlas_FilterSetId}.", filterSetId);

                return filterSetId;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateFilterSetCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var filterSet = _mapper.Map<FilterSet>(request);

                await _filterSetRepository.UpdateFilterSetAsync(filterSet);

                _unitOfWork.Commit();

                _logger.LogInformation("Filter set with id {Atlas_FilterSetId} updated.", request.FilterSetId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(DeleteFilterSetCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var filterSet = await _filterSetRepository.GetUserFilterSetByIdAsync(request.UserId, request.CompanyId, request.FilterSetId);

                var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), filterSet, Policies.FilterSetAdministratorPolicy);

                if (authorizationResult.Succeeded)
                {
                    await _filterSetRepository.DeleteFilterSetAsync(request.FilterSetId);
                }
                else
                {
                    throw new AtlasSecurityException("One or more privileges are required to perform this action.");
                }

                _unitOfWork.Commit();

                _logger.LogInformation("FilterSet with id {Atlas_FilterSetId} deleted.", request.FilterSetId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(CreateFavoriteFilterSetCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _filterSetRepository.CreateFavoriteFilterSetAsync(request.FilterSetId, request.GridCode, request.CompanyId);

                _unitOfWork.Commit();

                _logger.LogInformation("FilterSetId with id {Atlas_FilterSetId} was set as favorite.", request.FilterSetId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }
    }
}
