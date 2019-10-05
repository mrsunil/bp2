using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class FunctionalObjectCommandsHandler :
        IRequestHandler<CreateFunctionalObjectCommand, int>,
        IRequestHandler<UpdateFunctionalObjectCommand, int>
    {
        private readonly ILogger _logger;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IFunctionalObjectRepository _functionalObjectRepository;

        public FunctionalObjectCommandsHandler(
            ILogger<FunctionalObjectCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IFunctionalObjectRepository functionalObjectRepository)
        {
            _functionalObjectRepository = functionalObjectRepository ?? throw new ArgumentNullException(nameof(functionalObjectRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<int> Handle(CreateFunctionalObjectCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var exists = await _functionalObjectRepository.IsFunctionalObjectExistsAsync(request.Name);

                if (exists)
                {
                    throw new AtlasBusinessException($"A functional object with the name {request.Name} already exists.");
                }

                var functionalObject = ConvertToFunctionalObject(request, null);

                if (functionalObject != null)
                {
                    var functionalObjectId = await _functionalObjectRepository.CreateFunctionalObject(functionalObject);

                    _unitOfWork.Commit();

                    _logger.LogInformation("New functional object {Atlas_FunctionalObjectName} has been created.", request.Name);

                    return functionalObjectId;
                }
                else
                {
                    throw new AtlasBusinessException($"Invalid Request.");
                }
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<int> Handle(UpdateFunctionalObjectCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var exists = await _functionalObjectRepository.IsFunctionalObjectExistsAsync(request.Name, request.Id);

                if (exists)
                {
                    throw new AtlasBusinessException($"A functional object with the name {request.Name} already exists.");
                }

                var functionalObject = ConvertToFunctionalObject(null, request);
                if (functionalObject != null)
                {
                    functionalObject.Id = request.Id;
                    var functionalObjectId = await _functionalObjectRepository.UpdateFunctionalObject(functionalObject);

                    _unitOfWork.Commit();

                    _logger.LogInformation("Functional object {Atlas_FunctionalObjectName} has been updated.", request.Name);

                    return functionalObjectId;
                }
                else
                {
                    throw new AtlasBusinessException($"Invalid Request.");
                }
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        private static FunctionalObject ConvertToFunctionalObject(CreateFunctionalObjectCommand createCommand, UpdateFunctionalObjectCommand updateCommand)
        {
            if (createCommand != null && updateCommand == null)
            {
                return new FunctionalObject()
                {
                    Name = createCommand.Name,
                    Tables = new List<ApplicationTable>(createCommand.Keys.Select((key, index) => new ApplicationTable()
                    {
                        TableId = key.TableId,
                        Fields = new List<ApplicationField>(key.FieldIds.Select((id) => new ApplicationField() { FieldId = id }))
                    }))
                };
            }
            else if (createCommand == null && updateCommand != null)
            {
                return new FunctionalObject()
                {
                    Name = updateCommand.Name,
                    Tables = new List<ApplicationTable>(updateCommand.Keys.Select((key, index) => new ApplicationTable()
                    {
                        TableId = key.TableId,
                        Fields = new List<ApplicationField>(key.FieldIds.Select((id) => new ApplicationField() { FieldId = id }))
                    }))
                };
            }
            return null;
        }
    }
}
