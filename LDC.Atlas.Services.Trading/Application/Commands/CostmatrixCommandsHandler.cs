using AutoMapper;
using LDC.Atlas.Application.Common.Entities;
using LDC.Atlas.Application.Common.Tags;
using LDC.Atlas.Application.Common.Tags.Dto;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Trading.Entities;
using LDC.Atlas.Services.Trading.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Trading.Application.Commands
{
    public class CostMatrixCommandsHandler :
       IRequestHandler<CreateCostMatrixCommand, CostMatrixReference>,
        IRequestHandler<CreateCostMatrixWithParametersCommand, CostMatrixReference>,
        IRequestHandler<UpdateCostMatrixCommand>,
        IRequestHandler<UpdateCostMatrixWithParametersCommand>,
        IRequestHandler<DeleteCostMatrixCommand>,
        IRequestHandler<DeleteCostMatrixLineCommand>
    {
        private readonly ILogger<CostMatrixCommandsHandler> _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly ICostMatrixRepository _costmatrixRepository;
        private readonly ITagsService _tagsService;
        private readonly IMapper _mapper;

        public CostMatrixCommandsHandler(
            ILogger<CostMatrixCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            ICostMatrixRepository costmatrixRepository,
            IMapper mapper,
            ITagsService tagsService)
        {
            _costmatrixRepository = costmatrixRepository ?? throw new ArgumentNullException(nameof(costmatrixRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _tagsService = tagsService ?? throw new ArgumentNullException(nameof(tagsService));
        }

        public async Task<CostMatrixReference> Handle(CreateCostMatrixCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var costMatrix = _mapper.Map<CostMatrix>(request);

                var newCostmatrixId = await _costmatrixRepository.CreateCostMatrixAsync(costMatrix, request.Company);

                _logger.LogInformation("New cost matrix created with id {Atlas_CostMatrixId}.", newCostmatrixId);

                _unitOfWork.Commit();

                return new CostMatrixReference { CostMatrixId = newCostmatrixId };
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<CostMatrixReference> Handle(CreateCostMatrixWithParametersCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var costMatrix = _mapper.Map<CostMatrix>(request);

                var newCostmatrixId = await _costmatrixRepository.CreateCostMatrixAsync(costMatrix, request.Company);

                // Insert the tags on common service.
                EntityTagListDto requestTags = new EntityTagListDto();
                requestTags.EntityExternalId = newCostmatrixId.ToString(CultureInfo.InvariantCulture);
                requestTags.EntityTypeName = TagsEntityTypes.COSTMATRIX;

                requestTags.Tags = new List<TagDto>();
                if (request.Tags != null && request.Tags.Any())
                {
                    foreach (TagLine itemTagLine in request.Tags)
                    {
                        TagDto tag = new TagDto()
                        {
                            TagValueId = itemTagLine.Id,
                            TypeName = itemTagLine.TypeName
                        };
                        requestTags.Tags.Add(tag);
                    }
                }

                await _tagsService.CreateTagsAsync(requestTags, request.Company);

                _logger.LogInformation("New cost matrix created with id {Atlas_CostMatrixId}.", newCostmatrixId);

                _unitOfWork.Commit();

                return new CostMatrixReference { CostMatrixId = newCostmatrixId };
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateCostMatrixCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var costMatrix = _mapper.Map<CostMatrix>(request);

                foreach (var costMatrixLines in costMatrix.CostMatrixLines)
                {
                    costMatrixLines.CostMatrixId = costMatrix.CostMatrixId;
                }

                await _costmatrixRepository.UpdateCostMatrixAsync(costMatrix, request.Company);

                _logger.LogInformation("Cost matrix with id {Atlas_CostMatrixId} updated.", costMatrix.CostMatrixId);

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateCostMatrixWithParametersCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                var costMatrix = _mapper.Map<CostMatrix>(request);

                foreach (var costMatrixLines in costMatrix.CostMatrixLines)
                {
                    costMatrixLines.CostMatrixId = costMatrix.CostMatrixId;
                }

                await _costmatrixRepository.UpdateCostMatrixAsync(costMatrix, request.Company);


                EntityTagListDto requestTags = new EntityTagListDto();
                requestTags.EntityExternalId = request.CostMatrixId.ToString(CultureInfo.InvariantCulture);
                requestTags.EntityTypeName = TagsEntityTypes.COSTMATRIX;

                requestTags.Tags = new List<TagDto>();

                foreach (TagLine itemTagLine in request.Tags)
                {
                    TagDto tag = new TagDto()
                    {
                        TagValueId = itemTagLine.Id,
                        TypeName = itemTagLine.TypeName
                    };
                    requestTags.Tags.Add(tag);
                }

                await _tagsService.UpdateTagsAsync(requestTags, request.Company);

                _logger.LogInformation("Cost matrix with id {Atlas_CostMatrixId} updated.", costMatrix.CostMatrixId);

                _unitOfWork.Commit();

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteCostMatrixCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _costmatrixRepository.DeleteCostMatrixAsync(request.CostMatrixId);
                _logger.LogInformation("Cost matrix with id {Atlas_CostmatrixId} deleted.", request.CostMatrixId);

                _unitOfWork.Commit();
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(DeleteCostMatrixLineCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();
            try
            {
                await _costmatrixRepository.DeleteCostMatrixLineAsync(request.CostMatrixLineId);
                _logger.LogInformation("Cost matrix line with id {Atlas_CostMatrixLineId} deleted.", request.CostMatrixLineId);

                _unitOfWork.Commit();
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
