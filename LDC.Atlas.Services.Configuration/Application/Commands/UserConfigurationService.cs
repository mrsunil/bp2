using AutoMapper;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Entities;
using LDC.Atlas.Services.Configuration.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Commands
{
    public class UserConfigurationService : IUserConfigurationService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserConfigurationRepository _userConfigurationRepository;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;

        public UserConfigurationService(
            ILogger<UserConfigurationService> logger,
            IUnitOfWork unitOfWork,
            IUserConfigurationRepository userConfigurationRepository,
            IIdentityService identityService,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userConfigurationRepository = userConfigurationRepository;
            _logger = logger;
            _mapper = mapper;
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }

        public async Task CreateUserPreference(string company, CreateUserPreferenceCommand request)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                var userPreferences = new UserPreference
                {
                    ComponentId = request.ComponentId,
                    ColumnConfig = request.ColumnConfig
                };
                var userId = _identityService.GetUserAtlasId();
                userPreferences.UserId = userId;
                userPreferences.Company = company;

                await _userConfigurationRepository.CreateUserPreferenceColumnAsync(userPreferences);

                _unitOfWork.Commit();
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }
    }
}
