using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.UserIdentity.Entities;
using LDC.Atlas.Services.UserIdentity.Repositories;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Commands
{
    public class ProfileCommandsHandler : IRequestHandler<CreateProfileCommand, ProfileReference>,
        IRequestHandler<UpdateProfileCommand>,
        IRequestHandler<DeleteProfileCommand>
    {
        private readonly ILogger _logger;
        private readonly IIdentityService _identityService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IProfileRepository _profileRepository;

        public ProfileCommandsHandler(
            ILogger<ProfileCommandsHandler> logger,
            IIdentityService identityService,
            IUnitOfWork unitOfWork,
            IProfileRepository profileRepository)
        {
            _profileRepository = profileRepository ?? throw new ArgumentNullException(nameof(profileRepository));
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
        }

        public async Task<ProfileReference> Handle(CreateProfileCommand request, CancellationToken cancellationToken)
        {
            var sameNameExists = await _profileRepository.CheckProfileExistsAsync(request.Name);
            if (sameNameExists)
            {
                throw new AtlasBusinessException($"A profile with the name {request.Name} already exists.");
            }

            _unitOfWork.BeginTransaction();
            try
            {
                var profile = ConvertToProfile(request);

                var profileId = await _profileRepository.CreateProfileAsync(profile);

                _unitOfWork.Commit();

                _logger.LogInformation("New profile created with id {Atlas_ProfileId}.", profileId);

                return new ProfileReference { ProfileId = profileId, Name = profile.Name };
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateProfileCommand request, CancellationToken cancellationToken)
        {
            var exists = await _profileRepository.CheckProfileExistsAsync(request.ProfileId);

            if (!exists)
            {
                throw new NotFoundException("Profile", request.ProfileId);
            }

            var profileName = await _profileRepository.GetProfileNameAsync(request.ProfileId);

            if (profileName == "Administrator")
            {
                throw new AtlasBusinessException("The Administrator profile cannot be edited");
            }

            var sameNameExists = await _profileRepository.CheckProfileExistsAsync(request.Name, request.ProfileId);
            if (sameNameExists)
            {
                throw new AtlasBusinessException($"A profile with the name {request.Name} already exists.");
            }

            _unitOfWork.BeginTransaction();
            try
            {
                var profile = ConvertToProfile(request);

                await _profileRepository.UpdateProfileAsync(profile);

                _unitOfWork.Commit();

                _logger.LogInformation("Profile with id {Atlas_ProfileId} updated.", request.ProfileId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(DeleteProfileCommand request, CancellationToken cancellationToken)
        {
            var exists = await _profileRepository.CheckProfileExistsAsync(request.ProfileId);

            if (!exists)
            {
                throw new NotFoundException("Profile", request.ProfileId);
            }

            var profileName = await _profileRepository.GetProfileNameAsync(request.ProfileId);

            if (profileName == "Administrator")
            {
                throw new AtlasBusinessException("The Administrator profile cannot be deleted");
            }

            // A profile can not be deleted if it is assigned to at least one user account (activated or not).
            var nbUsers = await _profileRepository.GetNumberOfUsersAsync(request.ProfileId);

            if (nbUsers != 0)
            {
                throw new AtlasBusinessException($"This profile cannot be deleted because it is currently applied to {nbUsers} user(s).");
            }

            _unitOfWork.BeginTransaction();
            try
            {
                await _profileRepository.DeleteProfileAsync(request.ProfileId);

                _unitOfWork.Commit();

                _logger.LogInformation("Profile with id {Atlas_ProfileId} deleted.", request.ProfileId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        private static Profile ConvertToProfile(CreateProfileCommand request)
        {
            var profile = new Profile
            {
                Name = request.Name,
                Description = request.Description,
            };

            foreach (var item in request.Privileges)
            {
                profile.ProfilePrivileges.Add(new ProfilePrivilege
                {
                    PrivilegeId = item.PrivilegeId,
                    Permission = item.Permission
                });
            }

            return profile;
        }

        private static Profile ConvertToProfile(UpdateProfileCommand request)
        {
            var profile = new Profile
            {
                Id = request.ProfileId,
                Name = request.Name,
                Description = request.Description
            };

            foreach (var item in request.Privileges)
            {
                profile.ProfilePrivileges.Add(new ProfilePrivilege
                {
                    PrivilegeId = item.PrivilegeId,
                    Permission = item.Permission
                });
            }

            return profile;
        }
    }
}
