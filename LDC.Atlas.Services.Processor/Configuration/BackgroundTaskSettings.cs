namespace LDC.Atlas.Services.Processor.Configuration
{
    public class BackgroundTaskSettings
    {
        public string ProcessType { get; set; }

        public int CheckUpdateTime { get; set; } = 5000;

        public int HttpClientTimeout { get; set; } = 300;
    }
}
