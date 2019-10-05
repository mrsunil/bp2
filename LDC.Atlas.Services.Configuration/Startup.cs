using Autofac;
using Autofac.Extensions.DependencyInjection;
using AutoMapper;
using HealthChecks.UI.Client;
using LDC.Atlas.Application.Core;
using LDC.Atlas.Authorization.PolicyProvider.Extensions;
using LDC.Atlas.Authorization.PolicyProvider.Middleware;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Infrastructure;
using LDC.Atlas.Infrastructure.ApplicationInsights;
using LDC.Atlas.Infrastructure.Extensions;
using LDC.Atlas.Infrastructure.Json;
using LDC.Atlas.Infrastructure.Middlewares;
using LDC.Atlas.Infrastructure.Middlewares.Extensions;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Serilog;
using LDC.Atlas.Infrastructure.Services.Extensions;
using LDC.Atlas.Infrastructure.Swagger;
using LDC.Atlas.Infrastructure.Utils;
using LDC.Atlas.Services.Configuration.Application.Commands;
using LDC.Atlas.Services.Configuration.Extensions;
using LDC.Atlas.Services.Configuration.Infrastructure.Mapping;
using LDC.Atlas.Services.Configuration.Infrastructure.Modules;
using LDC.Atlas.Services.Configuration.Infrastructure.Policies;
using LDC.Atlas.Services.Configuration.Services;
using LDC.Atlas.Services.Execution.Infrastructure.Swagger;
using MediatR;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Swagger;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Net.Mime;
using System.Reflection;

[assembly: AtlasServiceAssembly(AtlasServiceNames.Configuration)]

namespace LDC.Atlas.Services.Configuration
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

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.AddMvc(options =>
            {
                options.CacheProfiles.Add(
                    "Never",
                    new CacheProfile
                    {
                        Location = ResponseCacheLocation.None,
                        NoStore = true
                    });

                options.Filters.Add(new AuthorizeFilter(new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build()));
                options.Filters.Add<AtlasLogEnrichmentFilter>();
                options.Filters.Add<ContextInformationFilter>();
            })
            .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
            .AddJsonOptions(opt =>
            {
                opt.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                opt.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                opt.SerializerSettings.DateParseHandling = DateParseHandling.DateTime;

                opt.SerializerSettings.Converters.Add(new TrimmingConverter());
            });

            // This code is added AFTER app.UseMvc(); otherwise it will not work.
            services.ConfigureInvalidModelStateResponseFactory();

            // ApplicationInsights
            services.AddSingleton<ITelemetryInitializer, ServiceContextTelemetryIntitializer>();
            services.AddSingleton<ITelemetryInitializer, UserTelemetryInitializer>();
            services.AddApplicationInsightsTelemetry(Configuration);

            // Register Configuration objects
            services.Configure<DatabaseConfiguration>(Configuration.GetSection("Database"));
            services.Configure<ApplicationInsightsConfiguration>(Configuration.GetSection("ApplicationInsights"));
            services.Configure<AzureAdConfiguration>("AtlasApiOAuth2", Configuration.GetSection("AtlasApiOAuth2"));
            services.Configure<ApplicationDetail>(Configuration.GetSection("AtlasApplication"));

            services.AddApplicationInsightsKubernetesEnricher();

            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            var tokenValidationParameters = new TokenValidationParameters
            {
                NameClaimType = AtlasClaimTypes.UniqueName
            };

            // Add Authentication services.
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(cfg =>
            {
                cfg.Audience = Configuration["OAuth2:ClientId"];
                cfg.Authority = Configuration["OAuth2:Authority"];
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = tokenValidationParameters;
            });

            // Register Hosted Services
            services.AddTransient<IUserConfigurationService, UserConfigurationService>();

            // Adds a default implementation for IHttpContextAccessor
            services.AddHttpContextAccessor();

            services.AddAtlasIdentityService();

            // Add custom authorization services and the authorization handlers to the services
            services.AddAtlasAuthorizationServices(Configuration)
                .AddAtlasPrivilegeAuthorizationHandlers();

            services.AddConfigurationAuthorizationPolicies();

            // Register Hosted Services
            services.AddTransient<IFeatureBitEvaluator, FeatureBitEvaluator>();

            // Register Hosted Services
            services.AddScoped<IDapperContext, DapperContext>();
            services.AddScoped<IUnitOfWork, DapperUnitOfWork>();
            services.AddScoped<IContextInformation, ContextInformation>();

            // Add custom authorization handlers
            // Use AddScoped and not AddSingleton, because they use scoped services in constructor
            services.AddScoped<IAuthorizationHandler, UpdateDeleteFilterSetHandler>();
            services.AddScoped<IAuthorizationHandler, UpdateDeleteGridViewHandler>();

            // Register all Handlers and Pre/PostProcessors in a given assembly.
            services.AddMediatR(typeof(Startup).Assembly);

            Mapper.Initialize(cfg => cfg.AddProfile<MappingProfile>());
            services.AddAutoMapper();

            if (Configuration["SwaggerGen"].Equals(bool.TrueString, StringComparison.InvariantCultureIgnoreCase))
            {
                services.AddSwaggerGen(c =>
                {
                    c.SwaggerDoc("v1", new Info { Title = "Configuration API", Version = "v1" });
                    c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                    {
                        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                        Name = "Authorization",
                        In = "header",
                        Type = "apiKey"
                    });
                    c.DescribeAllParametersInCamelCase();
                    c.OperationFilter<AddResponseHeadersFilter>(); // To use the [SwaggerResponseHeader] attribute
                    c.DocumentFilter<LowercaseDocumentFilter>(); // To lowercase the URIs

                    // Set the comments path for the Swagger JSON and UI.
                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    c.IncludeXmlComments(xmlPath);

                    var security = new System.Collections.Generic.Dictionary<string, System.Collections.Generic.IEnumerable<string>>
                    {
                        { "Bearer", Array.Empty<string>() },
                    };
                    c.AddSecurityRequirement(security);
                });
            }

            services.AddTokenManagement();

            services.AddAtlasServices(Configuration);

            var containerBuilder = new ContainerBuilder();
            containerBuilder.Populate(services);
            containerBuilder.RegisterModule(new MediatorModule());

            // Register types from LDC.Atlas.Application.Common
            containerBuilder.RegisterModule(new Atlas.Application.Common.MediatorModule());

            // Register types from LDC.Atlas.MasterData.Common
            containerBuilder.RegisterModule(new MasterData.Common.MediatorModule());

            return new AutofacServiceProvider(containerBuilder.Build());
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            var serviceNamespace = "configuration";

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
                            new JProperty("atlasServiceName", AppInfoUtils.AtlasServiceName),
                            new JProperty("checkedAt", DateTime.UtcNow));

                        return httpContext.Response.WriteAsync(json.ToString(Formatting.Indented));
                    }
                });

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAtlasExceptionHandling();

            app.UseSecurityHeaders();

            app.UseCors("CorsPolicy");

            app.UseAuthentication();

            app.UseRouteMiddleware();

            // Load the current user privileges for the current company
            app.UseAtlasCurrentUserPrivileges();

            if (Configuration["SwaggerGen"].Equals(bool.TrueString, StringComparison.InvariantCultureIgnoreCase))
            {
                var apiRoot = Configuration["ApiRoot"];

                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger(c => { c.RouteTemplate = $"api/v1/{serviceNamespace}/swagger/{{documentName}}/swagger.json"; });

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.), specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    c.RoutePrefix = $"api/v1/{serviceNamespace}/swagger";
                    c.SwaggerEndpoint(apiRoot + $"/api/v1/{serviceNamespace}/swagger/v1/swagger.json", "Configuration V1");
                });
            }

            app.UseMvc();
        }
    }
}
