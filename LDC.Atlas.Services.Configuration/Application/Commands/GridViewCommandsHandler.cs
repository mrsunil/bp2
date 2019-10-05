using AutoMapper;
using LDC.Atlas.Application.Common.Configuration;
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
    public class GridViewCommandsHandler : IRequestHandler<CreateGridViewCommand, int>,
       IRequestHandler<UpdateGridViewCommand>,
       IRequestHandler<DeleteGridViewCommand>,
       IRequestHandler<SetFavoriteGridViewCommand>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IGridViewRepository _gridViewRepository;
        private readonly IGridService _gridQuery;
        private readonly IMapper _mapper;
        private readonly IAuthorizationService _authorizationService;
        private readonly IIdentityService _identityService;

        public GridViewCommandsHandler(
            ILogger<GridViewCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IGridViewRepository gridViewRepository,
            IGridService gridQuery,
            IMapper mapper,
            IAuthorizationService authorizationService,
            IIdentityService identityService)
        {
            _gridQuery = gridQuery ?? throw new ArgumentNullException(nameof(gridQuery));
            _gridViewRepository = gridViewRepository ?? throw new ArgumentNullException(nameof(gridViewRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _authorizationService = authorizationService ?? throw new ArgumentNullException(nameof(authorizationService));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }

        public async Task<int> Handle(CreateGridViewCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var gridInfo = await _gridQuery.GetGrid(request.GridCode, request.CompanyId);
                if (gridInfo != null)
                {
                    if (gridInfo.HasMultipleViewsPerUser)
                    {
                        var gridView = _mapper.Map<GridView>(request);

                        var existingGridViews = await _gridViewRepository.IsGridViewNameExists(gridView.CompanyId, gridView.GridCode, gridView.Name);
                        if (existingGridViews)
                        {
                            throw new AtlasBusinessException("The name view is already used, please change it for saving to be completed.");
                        }

                        var gridViewId = await _gridViewRepository.CreateGridViewAsync(gridView);

                        _unitOfWork.Commit();

                        _logger.LogInformation("New gridView created with id {Atlas_GridViewId}.", gridViewId);

                        return gridViewId;
                    }
                    else
                    {
                        throw new AtlasSecurityException("Grid Does not allow multiple Views");
                    }
                }
                else
                {
                    throw new NotFoundException("Grid Info not found for gridId: " + request.GridCode);
                }
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateGridViewCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var gridInfo = await _gridQuery.GetGrid(request.GridCode, request.CompanyId);
                if (gridInfo != null)
                {
                    if (gridInfo.HasMultipleViewsPerUser)
                    {
                        var gridView = _mapper.Map<GridView>(request);
                        var existingGridView = await _gridViewRepository.GetUserGridViewByIdAsync(gridView.CompanyId, gridView.GridViewId);

                        if (!existingGridView.IsDefault)
                        {
                            if (existingGridView.CreatedBy == _identityService.GetUserName())
                            {
                                await _gridViewRepository.UpdateGridViewAsync(gridView);
                                _unitOfWork.Commit();
                                _logger.LogInformation("Grid View with id {Atlas_GridViewId} updated.", request.GridViewId);
                            }
                            else
                            {
                                throw new AtlasSecurityException("Cannot update GridViews which are not yours");
                            }
                        }
                        else
                        {
                            throw new AtlasSecurityException("Cannot update Default GridView");
                        }
                    }
                    else
                    {
                        throw new AtlasSecurityException("Grid does not support update operation / Does not have multiple views");
                    }
                }
                else
                {
                    throw new NotFoundException("Grid Info not found for gridId: " + request.GridCode);
                }
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(DeleteGridViewCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var gridView = await _gridViewRepository.GetUserGridViewByIdAsync(request.CompanyId, request.GridViewId);

                var authorizationResult = await _authorizationService.AuthorizeAsync(_identityService.GetUser(), gridView, Policies.GridViewAdministratorPolicy);

                if (authorizationResult.Succeeded)
                {
                    // Check that you are deleting a View that is created by the user
                    if (gridView.CreatedBy == request.UserId)
                    {
                        await _gridViewRepository.DeleteGridViewAsync(request.GridViewId);
                    }
                    else
                    {
                        throw new AtlasSecurityException("Cannot delete GridViews which are not yours");
                    }
                }
                else
                {
                    throw new AtlasSecurityException("It seems you need to be Administrator to do this");
                }

                _unitOfWork.Commit();

                _logger.LogInformation("GridView with id {Atlas_GridViewId} deleted.", request.GridViewId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(SetFavoriteGridViewCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var gridInfo = await _gridQuery.GetGrid(request.GridCode, request.CompanyId);
                if (gridInfo != null)
                {
                    if (gridInfo.HasMultipleViewsPerUser)
                    {
                        var existingGridView = await _gridViewRepository.GetUserGridViewByIdAsync(request.CompanyId, request.GridViewId);

                        if (existingGridView != null)
                        {
                            await _gridViewRepository.SetGridViewAsFavoriteAsync(request.GridViewId, request.GridCode, request.CompanyId);
                        }
                        else
                        {
                            throw new NotFoundException("Gridview does not exist with Id: " + request.GridViewId);
                        }
                    }
                    else
                    {
                        // This is to be considered as save with unique per grid
                        var gridView = new GridView();
                        gridView.CompanyId = request.CompanyId;
                        gridView.GridViewColumnConfig = request.GridViewColumnConfig;
                        gridView.GridCode = request.GridCode;

                        await _gridViewRepository.SaveUniqueGridViewAsFavoriteAsync(gridView);
                    }

                    _unitOfWork.Commit();

                    _logger.LogInformation("GridViewId with id {Atlas_GridViewId} was set as favorite.", request.GridViewId);
                }
                else
                {
                    throw new NotFoundException("Grid Info not found for gridId: " + request.GridCode);
                }
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
