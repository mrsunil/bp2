using LDC.Atlas.Services.Processor.Configuration;
using LDC.Atlas.Services.Processor.Entities;
using LDC.Atlas.Services.Processor.Repositories;
using LDC.Atlas.Services.Processor.Services;
using Microsoft.ApplicationInsights;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Processor.Tasks
{
    // https://docs.microsoft.com/en-us/dotnet/standard/microservices-architecture/multi-container-microservice-net-applications/background-tasks-with-ihostedservice
    // https://github.com/dotnet-architecture/eShopOnContainers/tree/dev/src/Services/Ordering/Ordering.BackgroundTasks
    public class ProcessorService : BackgroundService
    {
        private readonly BackgroundTaskSettings _settings;
        private readonly ILogger<ProcessorService> _logger;
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly AtlasService _atlasService;

        private readonly TelemetryClient _telemetryClient = new TelemetryClient(TelemetryConfiguration.Active);

        public ProcessorService(IOptions<BackgroundTaskSettings> settings, ILogger<ProcessorService> logger, IServiceScopeFactory serviceScopeFactory, AtlasService atlasService)
        {
            _settings = settings?.Value ?? throw new ArgumentNullException(nameof(settings));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceScopeFactory = serviceScopeFactory;

            _atlasService = atlasService ?? throw new ArgumentNullException(nameof(atlasService));
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ProcessorService is starting with type {Atlas_ProcessTypeName}.", _settings.ProcessType);

            stoppingToken.Register(() => _logger.LogInformation("#1 ProcessorService background task is stopping."));

            while (!stoppingToken.IsCancellationRequested)
            {
                //var operation = _telemetryClient.StartOperation<RequestTelemetry>(_settings.ProcessType);
                //operation.Telemetry.GenerateOperationId();

                _logger.LogDebug($"ProcessorService {_settings.ProcessType} background task is doing background work.");

                using (var scope = _serviceScopeFactory.CreateScope())
                {
                    try
                    {
                        await RunAsync(scope.ServiceProvider, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Error executing background task {Atlas_ProcessTypeName}.", _settings.ProcessType);
                    }
                    //finally
                    //{
                        //_telemetryClient.StopOperation(operation);
                    //}
                }

                await Task.Delay(_settings.CheckUpdateTime, stoppingToken);
            }

            _logger.LogInformation($"ProcessorService {_settings.ProcessType} background task is stopping.");

            await Task.CompletedTask;
        }

        private async Task RunAsync(IServiceProvider scopeServiceProvider, CancellationToken cancellationToken)
        {
            var messageRepository = scopeServiceProvider.GetRequiredService<IMessageRepository>();

            var processType = await messageRepository.GetProcessType(_settings.ProcessType);

            if (processType == null)
            {
                throw new Exception($"No process type found for '{_settings.ProcessType}'.");
            }

            var isProcessActive = processType.IsActive;

            if (!isProcessActive)
            {
                _logger.LogWarning($"Process type {_settings.ProcessType} is not active.");
            }

            // Check if process active
            while (isProcessActive)
            {
                var requestActivity = new System.Diagnostics.Activity($"{ _settings.ProcessType }_Run");
                requestActivity.Start();
                var requestOperation = _telemetryClient.StartOperation<RequestTelemetry>(requestActivity);

                // Check if message(s) to process and is active​
                var message = await CheckMessageToProcess(processType.ProcessTypeId, messageRepository);

                if (message != null)
                {
                    // Process message
                    await ProcessMessage(message, processType, messageRepository);
                }
                else
                {
                    await Task.Delay(_settings.CheckUpdateTime, cancellationToken);
                }

                isProcessActive = await CheckProcessActive(_settings.ProcessType, messageRepository);

                _telemetryClient.StopOperation(requestOperation);
            }
        }

        private async Task<bool> CheckProcessActive(string processTypeName, IMessageRepository messageRepository)
        {
            _logger.LogDebug("Checking if {Atlas_ProcessTypeName} process is active.", processTypeName);

            var processType = await messageRepository.GetProcessType(processTypeName);

            if (processType == null)
            {
                throw new Exception($"No process type found for '{processType}'");
            }

            return processType.IsActive;
        }

        private async Task<Message> CheckMessageToProcess(int processTypeId, IMessageRepository messageRepository)
        {
            _logger.LogDebug("Checking if message to process.");

            var message = await messageRepository.CheckAndReceiveMessageToProcess(processTypeId);

            if (message != null)
            {
                _logger.LogInformation("Found message {Atlas_MessageId} to process.", message.MessageId);
            }

            return message;
        }

        private async Task ProcessMessage(Message message, ProcessType processType, IMessageRepository messageRepository)
        {
            _logger.LogInformation("Processing message {@Atlas_Message} with process type {Atlas_ProcessType}.", message, processType);

            try
            {
                await _atlasService.CallAtlasApiAsync(message, processType);

                await messageRepository.UpdateMessageStatus(message.MessageId, MessageStatus.Success, null);
                message.Status = MessageStatus.Success;
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);

                await messageRepository.UpdateMessageStatus(message.MessageId, MessageStatus.Error, e.Message);
                message.Status = MessageStatus.Error;
            }
        }

        private async Task DeleteMessage(Message message, ProcessType processType, IMessageRepository messageRepository)
        {
            _logger.LogInformation("Deleting message {@Atlas_Message} with process type {Atlas_ProcessType}.", message, processType);

            try
            {
                await messageRepository.DeleteMessageFromQueue(message.MessageId);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
            }
        }
    }
}
