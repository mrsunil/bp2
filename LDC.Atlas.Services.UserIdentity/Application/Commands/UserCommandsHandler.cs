using AutoMapper;
using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Application.Core.Services;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.UserIdentity.Application.Queries;
using LDC.Atlas.Services.UserIdentity.Application.Queries.Dto;
using LDC.Atlas.Services.UserIdentity.Entities;
using LDC.Atlas.Services.UserIdentity.Repositories;
using LDC.Atlas.Services.UserIdentity.Services.Graph;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Application.Commands
{
    public class UserCommandsHandler :
        IRequestHandler<CreateUserCommand, UserReference>,
        IRequestHandler<UpdateUserCommand>,
        IRequestHandler<DeleteUserCommand>,
        IRequestHandler<UpdateUserLastConnectionDateCommand, Unit>,
        IRequestHandler<InsertUpdateActiveDirectoryUserCommand, Unit>
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IUserRepository _userRepository;
        private readonly IIdentityService _identityService;
        private readonly ILogger _logger;
        private readonly IMapper _mapper;
        private readonly IGraphClient _graphClient;
        private readonly IUserQueries _userQueries;

        public UserCommandsHandler(
            ILogger<UserCommandsHandler> logger,
            IUnitOfWork unitOfWork,
            IUserRepository userRepository,
            IIdentityService identityService,
            IGraphClient graphClient,
            IMapper mapper,
            IUserQueries userQueries)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _userRepository = userRepository ?? throw new ArgumentNullException(nameof(userRepository));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _identityService = identityService ?? throw new ArgumentNullException(nameof(identityService));
            _graphClient = graphClient ?? throw new ArgumentNullException(nameof(graphClient));
            _userQueries = userQueries ?? throw new ArgumentNullException(nameof(userQueries));
        }

        public async Task<UserReference> Handle(CreateUserCommand request, CancellationToken cancellationToken)
        {
            var exists = await _userRepository.CheckUserExistsAsync(request.UserPrincipalName);

            if (exists)
            {
                throw new AtlasBusinessException($"A user with the id {request.UserPrincipalName} already exists.");
            }

            _unitOfWork.BeginTransaction();

            try
            {
                // Get the new user from AD
                var userFromAd = await _graphClient.GetUserByIdAsync(request.UserPrincipalName);

                if (userFromAd == null)
                {
                    throw new Exception($"User {request.UserPrincipalName} not found in Active Directory");
                }

                var user = _mapper.Map<User>(request);

                // Filled user fields with values from AD
                user.AzureObjectIdentifier = userFromAd.Id;
                user.Email = userFromAd.Mail;
                user.FirstName = userFromAd.GivenName;
                user.LastName = userFromAd.Surname;
                user.FavoriteLanguage = user.FavoriteLanguage ?? userFromAd.PreferredLanguage;
                user.Location = userFromAd.OfficeLocation;
                user.PhoneNumber = userFromAd.MobilePhone;
                user.DisplayName = userFromAd.DisplayName;
                user.UserPrincipalName = userFromAd.UserPrincipalName;
                user.SamAccountName = userFromAd.OnPremisesSamAccountName;
                user.CompanyRole = userFromAd.JobTitle;

                user.Permissions.ToList().ForEach(p => p.Departments.ToList().ForEach(d => d.CompanyId = p.CompanyId));

                // Seach user manager in AD
                try
                {
                    var manager = (await _graphClient.GetUserManagerByIdAsync(request.UserPrincipalName)) as Microsoft.Graph.User;

                    if (manager != null)
                    {
                        user.ManagerSamAccountName = manager.OnPremisesSamAccountName;

                        // Generate a SamAccountName if not provided by AD
                        if (string.IsNullOrWhiteSpace(user.ManagerSamAccountName))
                        {
                            var name = manager.Mail ?? manager.UserPrincipalName;
                            user.ManagerSamAccountName = name.Split('@').First();
                        }
                    }
                }
#pragma warning disable CA1031 // Do not catch general exception types
                catch (Exception e)
                {
                    _logger.LogError(e, $"Cannot found manager for user {request.UserPrincipalName}");
                }
#pragma warning restore CA1031 // Do not catch general exception types

                // Generate a DisplayName if not provided by AD
                if (string.IsNullOrWhiteSpace(user.DisplayName))
                {
                    user.DisplayName = $"{user.FirstName} {user.LastName}".Trim();
                }

                // Generate a SamAccountName if not provided by AD
                if (string.IsNullOrWhiteSpace(user.SamAccountName))
                {
                    var name = user.Email ?? user.UserPrincipalName;
                    user.SamAccountName = name.Split('@').First();
                }

                var userId = await _userRepository.CreateUserAsync(user);

                _unitOfWork.Commit();

                _logger.LogInformation("New user created with id {Atlas_UserId}.", userId);

                return new UserReference { UserId = userId };
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(UpdateUserCommand request, CancellationToken cancellationToken)
        {
            var exists = await _userRepository.CheckUserExistsAsync(request.UserId);

            if (!exists)
            {
                throw new NotFoundException("User", request.UserId);
            }

            _unitOfWork.BeginTransaction();

            try
            {
                var user = _mapper.Map<User>(request);
                user.Permissions.ToList().ForEach(p => p.Departments.ToList().ForEach(d => d.CompanyId = p.CompanyId));

                await _userRepository.UpdateUserAsync(user);

                _unitOfWork.Commit();

                _logger.LogInformation("User with id {Atlas_UserId} has been updated.", user.UserId);

                return Unit.Value;
            }
            catch (Exception)
            {
                _unitOfWork.Rollback();
                throw;
            }
        }

        public async Task<Unit> Handle(DeleteUserCommand request, CancellationToken cancellationToken)
        {
            var exists = await _userRepository.CheckUserExistsAsync(request.UserId);

            if (!exists)
            {
                throw new NotFoundException("User", request.UserId);
            }

            _unitOfWork.BeginTransaction();

            try
            {
                await _userRepository.DeleteUserAssignmentsAsync(request.UserId);

                await _userRepository.DeleteUserAsync(request.UserId);

                _unitOfWork.Commit();

                _logger.LogInformation("User with id {Atlas_UserId} deleted by user.", request.UserId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(UpdateUserLastConnectionDateCommand request, CancellationToken cancellationToken)
        {
            var exists = await _userRepository.CheckUserExistsAsync(request.UserId);

            if (!exists)
            {
                throw new NotFoundException("User", request.UserId);
            }

            _unitOfWork.BeginTransaction();

            try
            {
                await _userRepository.UpdateUserLastConnectionDate(request.UserId);

                _unitOfWork.Commit();

                _logger.LogInformation("Last connection date has been updated for user with id {Atlas_UserId}.", request.UserId);
            }
            catch
            {
                _unitOfWork.Rollback();
                throw;
            }

            return Unit.Value;
        }

        public async Task<Unit> Handle(InsertUpdateActiveDirectoryUserCommand request, CancellationToken cancellationToken)
        {
            _unitOfWork.BeginTransaction();

            try
            {
                List<UserIAG> userIAGList = new List<UserIAG>();
                IEnumerable<UserDto> usersInAtlas;

                var usersFromAd = await _graphClient.GetTransitiveGroupMembersAsync();

                if (!usersFromAd.Any())
                {
                    throw new Exception($"No users not found in Active Directory");
                }

                usersInAtlas = await _userQueries.GetUsersAsync();

                foreach (Microsoft.Graph.User user in usersFromAd.OfType<Microsoft.Graph.User>())
                {
                    UserIAG userIAG = new UserIAG();
                    userIAG.UserId = user.UserPrincipalName;
                    userIAG.IsDisabled = user.AccountEnabled ?? false;
                    userIAG.DifferentADCompanyRole = false;
                    userIAG.DifferentADManager = false;
                    userIAG.CompanyRole = user.JobTitle;
                    if (usersInAtlas.Any())
                    {
                        var userFound = usersInAtlas.Where(x => x.UserPrincipalName == userIAG.UserId).FirstOrDefault();
                        if (userFound != null)
                        {
                            userIAG.DifferentADCompanyRole = userFound.CompanyRole == userIAG.CompanyRole ? false : true;

                            try
                            {
                                var manager = (await _graphClient.GetUserManagerByIdAsync(user.Id)) as Microsoft.Graph.User;
                                if (manager != null)
                                {
                                    userIAG.ManagerSamAccountName = manager.OnPremisesSamAccountName;

                                    // Generate a SamAccountName if not provided by AD
                                    if (string.IsNullOrWhiteSpace(userIAG.ManagerSamAccountName))
                                    {
                                        var name = manager.Mail ?? manager.UserPrincipalName;
                                        userIAG.ManagerSamAccountName = name.Split('@').First();
                                    }

                                    var managerFound = usersInAtlas.Where(x => x.ManagerSamAccountName == userIAG.ManagerSamAccountName).FirstOrDefault();
                                    if (managerFound != null)
                                    {
                                        userIAG.DifferentADManager = managerFound.ManagerSamAccountName == userIAG.ManagerSamAccountName ? false : true;
                                    }
                                }
                            }
#pragma warning disable CA1031 // Do not catch general exception types
                            catch (Exception ex)
                            {
                                _logger.LogError(ex, "Manager not found for {User}", user.DisplayName);
                            }
#pragma warning restore CA1031 // Do not catch general exception types

                            userIAGList.Add(userIAG);
                        }
                    }
                }

                if (userIAGList.Count() > 0)
                {
                    await _userRepository.UpdateUserIAGAsync(userIAGList);
                }

                _unitOfWork.Commit();

                _logger.LogInformation("Sync completed successfully");
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
