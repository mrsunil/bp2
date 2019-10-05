using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Application.Commands.Dto;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class UserPreferencesCommandHandler : IRequestHandler<CreateUserPreferencesCommand>,
        IRequestHandler<UpdateUserPreferencesCommand>
    {

        private readonly ILogger<UserPreferencesCommandHandler> _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IUserPreferencesRepository _userPreferencesRepository;

        public UserPreferencesCommandHandler(
           ILogger<UserPreferencesCommandHandler> logger,
           IIdentityService identityService,
           IUnitOfWork unitOfWork,
             IMapper mapper,
           IUserPreferencesRepository userPreferencesRepository)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _userPreferencesRepository = userPreferencesRepository ?? throw new ArgumentNullException(nameof(userPreferencesRepository));
        }
        /// <summary>
        /// Creates user preference for global parameter
        /// </summary>
        /// <param name="request">The command object that contains all the properties to create user preference.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(CreateUserPreferencesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userPreferenceCreation = _mapper.Map<UserPreferences>(request);

                if (userPreferenceCreation.UserPreferencesSetup != null)
                {
                    await _userPreferencesRepository.CreateUserPreferencesSetup(userPreferenceCreation.UserPreferencesSetup);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("User preference created successfully.");

                return Unit.Value;
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }


        /// <summary>
        /// Handling the "update" event of user preferences
        /// </summary>
        /// <param name="request">The command object that contains all the properties to update user preference.</param>
        /// <param name="cancellationToken">Token to cancel the operation.</param>
        public async Task<Unit> Handle(UpdateUserPreferencesCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userPreferenceUpdation = _mapper.Map<UserPreferences>(request);

                if (userPreferenceUpdation.UserPreferencesSetup != null)
                {
                    await _userPreferencesRepository.UpdateUserPreferencesSetup(userPreferenceUpdation.UserPreferencesSetup);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("User preference updated successfully");

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
