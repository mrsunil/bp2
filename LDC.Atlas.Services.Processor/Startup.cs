using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using HealthChecks.UI.Client;
using LDC.Atlas.Application.Core;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure.ApplicationInsights;
using LDC.Atlas.Infrastructure.Extensions;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Utils;
using LDC.Atlas.Services.Processor.Configuration;
using LDC.Atlas.Services.Processor.Extensions;
using LDC.Atlas.Services.Processor.Infrastructure.Mapping;
using LDC.Atlas.Services.Processor.Infrastructure.Modules;
using LDC.Atlas.Services.Processor.Tasks;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Mime;

namespace LDC.Atlas.Services.Processor
{
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public IServiceProvider ConfigureServices(IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy())
                .AddSqlServer(Configuration["Database:ConnectionString"], tags: new[] { "services" });

            // ApplicationInsights
            services.AddSingleton<ITelemetryInitializer, ServiceContextTelemetryIntitializer>();
            services.AddApplicationInsightsTelemetry(Configuration);

            // Register Configuration objects
            services.Configure<DatabaseConfiguration>(Configuration.GetSection("Database"));
            services.Configure<ApplicationInsightsConfiguration>(Configuration.GetSection("ApplicationInsights"));
            services.Configure<AzureAdConfiguration>("AtlasApiOAuth2", Configuration.GetSection("AtlasApiOAuth2"));

            services.AddApplicationInsightsKubernetesEnricher();

            // Register Hosted Services
            services.AddScoped<IDapperContext, DapperContext>();
            services.AddScoped<IUnitOfWork, DapperUnitOfWork>();
            services.AddScoped<IContextInformation, ContextInformation>();

            // Configure settings
            services.Configure<BackgroundTaskSettings>(Configuration.GetSection("BackgroundTask"));
            services.AddOptions();

            // Configure background task
            services.AddSingleton<IHostedService, ProcessorService>();

            services.AddTokenManagement();

            services.AddAtlasServices(Configuration);

            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });

            var containerBuilder = new ContainerBuilder();
            containerBuilder.Populate(services);
            containerBuilder.RegisterModule(new MediatorModule());
            return new AutofacServiceProvider(containerBuilder.Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, Microsoft.AspNetCore.Hosting.IHostingEnvironment env)
        {
            var processType = Configuration["BackgroundTask:ProcessType"];

            string serviceNamespace = null;

            if (env.IsDevelopment())
            {
                serviceNamespace = "processor";
            }
            else
            {
                serviceNamespace = processType.Replace("Atlas", string.Empty, StringComparison.InvariantCultureIgnoreCase).ToLowerInvariant();
            }

            app.UseHealthChecks($"/api/v1/{serviceNamespace}/hc/self", new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("self", StringComparison.InvariantCultureIgnoreCase)
            });

            app.UseHealthChecks($"/api/v1/{serviceNamespace}/hc/ready", new HealthCheckOptions
            {
                Predicate = r => r.Tags.Contains("services")
            });

            app.UseHealthChecks($"/api/v1/{serviceNamespace}/hc/uiresponse", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseHealthChecks(
                $"/api/v1/{serviceNamespace}/hc",
                new HealthCheckOptions()
                {
                    ResponseWriter = (httpContext, result) =>
                    {
                        httpContext.Response.ContentType = MediaTypeNames.Application.Json;

                        var json = new JObject(
                            new JProperty("status", result.Status.ToString()),
                            new JProperty("atlasVersion", AppInfoUtils.InformationalVersion),
                            new JProperty("atlasServiceName", processType),
                            new JProperty("checkedAt", DateTime.UtcNow));

                        return httpContext.Response.WriteAsync(json.ToString(Formatting.Indented));
                    }
                });
        }
    }
}
