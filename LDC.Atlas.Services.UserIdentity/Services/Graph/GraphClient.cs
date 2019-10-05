using LDC.Atlas.Application.Core.Exceptions;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Services.Token;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.UserIdentity.Services.Graph
{
    public class GraphClient : IGraphClient
    {
        private const string UserDefaultSelect = "id,businessPhones,mobilePhone,officeLocation,preferredLanguage,displayName,givenName,surname,userPrincipalName,onPremisesDomainName,mail,onPremisesImmutableId,onPremisesSamAccountName,userType,jobTitle";
        private const string ManagerDefaultSelect = "id,userPrincipalName,mail";

        private readonly ITokenProvider _tokenProvider;
        private IGraphServiceClient _graphClient;
        private readonly Microsoft.Extensions.Logging.ILogger _logger;
        private readonly AzureAdConfiguration _azureAdConfiguration;

        public GraphClient(ITokenProvider tokenProvider, ILogger<GraphClient> logger, IOptionsSnapshot<AzureAdConfiguration> azureAdConfiguration)
        {
            _tokenProvider = tokenProvider;
            _logger = logger;
            _azureAdConfiguration = azureAdConfiguration.Value;
        }

        private IGraphServiceClient GetGraphServiceClient()
        {
            var authenticationProvider = new DelegateAuthenticationProvider(async request =>
            {
                var accessToken = await _tokenProvider.GetBearerTokenAsync();
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            });

            _graphClient = new GraphServiceClient(authenticationProvider);
            return _graphClient;
        }

        public async Task<User> GetUserByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            List<QueryOption> options = new List<QueryOption>
            {
                new QueryOption("$select", UserDefaultSelect)
            };

            var graphClient = GetGraphServiceClient();

            var user = await graphClient.Users[System.Net.WebUtility.UrlEncode(userId)].Request(options).GetAsync();

            return user;
        }

        public async Task<DirectoryObject> GetUserManagerByIdAsync(string userId)
        {
            if (string.IsNullOrEmpty(userId))
            {
                throw new ArgumentNullException(nameof(userId));
            }

            List<QueryOption> options = new List<QueryOption>
            {
                new QueryOption("$select", ManagerDefaultSelect)
            };

            var graphClient = GetGraphServiceClient();

            var user = await graphClient.Users[System.Net.WebUtility.UrlEncode(userId)].Manager.Request(options).GetAsync();
            return user;
        }

        public async Task<IGraphServiceUsersCollectionPage> SearchUsersAsync(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
            {
                throw new ArgumentNullException(nameof(searchTerm));
            }

            if (searchTerm.Length < 3)
            {
                throw new Exception("The searchTerm must be at least 3 characters long.");
            }

            List<QueryOption> options = new List<QueryOption>
            {
                new QueryOption("$select", UserDefaultSelect),
                new QueryOption("$filter", $"startswith(Mail, '{searchTerm}') or startswith(GivenName, '{searchTerm}') or startswith(Surname, '{searchTerm}') or startswith(UserPrincipalName, '{searchTerm}')")
            };

            var graphClient = GetGraphServiceClient();

            IGraphServiceUsersCollectionPage users = await graphClient.Users.Request(options).GetAsync();

            return users;
        }

        public async Task<List<DirectoryObject>> GetTransitiveGroupMembersAsync()
        {
            string groupId = _azureAdConfiguration.GroupId;
            if (string.IsNullOrEmpty(groupId))
            {
                throw new AtlasTechnicalException("No group id specified in configuration file.");
            }

            List<QueryOption> options = new List<QueryOption>
            {
                new QueryOption("$select", UserDefaultSelect)
            };

            var graphClient = GetGraphServiceClient();
            var usersFound = new List<DirectoryObject>();
            try
            {
                var members = await graphClient.Groups[System.Net.WebUtility.UrlEncode(groupId)].TransitiveMembers.Request(options).GetAsync();

                usersFound.AddRange(members.CurrentPage);
                _logger.LogInformation($"Numbers of users retrieved per page: {members.Count}");
                while (members.NextPageRequest != null)
                {
                    members = members.NextPageRequest.GetAsync().Result;
                    usersFound.AddRange(members.CurrentPage);
                    _logger.LogInformation($"Numbers of users retrieved per page: {members.Count}");
                }

                _logger.LogInformation($"Numbers of users retrieved for group {groupId}: {members.Count}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Either this group id does not exist or there are no members in this group : {groupId}.");
                throw;
            }

            return usersFound;
        }
    }
}
