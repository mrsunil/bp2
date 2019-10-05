using LDC.Atlas.Infrastructure.Services.Token;
using Microsoft.Graph;

namespace LDC.Atlas.Services.Document.Services
{
    public class GraphClientProvider : IGraphClientProvider
    {
        private readonly ITokenProvider _tokenProvider;
        private IGraphServiceClient _graphClient;

        public GraphClientProvider(ITokenProvider tokenProvider)
        {
            _tokenProvider = tokenProvider;
        }

        public IGraphServiceClient GetGraphServiceClient()
        {
            if (_graphClient != null)
            {
                return _graphClient;
            }

            var authenticationProvider = new DelegateAuthenticationProvider(async request =>
            {
                var accessToken = await _tokenProvider.GetBearerTokenAsync();
                request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            });

            _graphClient = new GraphServiceClient(authenticationProvider);
            return _graphClient;
        }
    }
}
