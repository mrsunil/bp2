using Microsoft.Graph;

namespace LDC.Atlas.Services.Document.Services
{
    public interface IGraphClientProvider
    {
        IGraphServiceClient GetGraphServiceClient();
    }
}
