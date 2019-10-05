using HealthChecks.UI.Client;
using LDC.Atlas.Infrastructure;
using LDC.Atlas.Infrastructure.ApplicationInsights;
using LDC.Atlas.Infrastructure.Extensions;
using LDC.Atlas.Infrastructure.Json;
using LDC.Atlas.Infrastructure.Middlewares.Extensions;
using LDC.Atlas.Infrastructure.Models;
using LDC.Atlas.Infrastructure.Serilog;
using LDC.Atlas.Infrastructure.Services.Extensions;
using LDC.Atlas.Infrastructure.Utils;
using Microsoft.ApplicationInsights.Extensibility;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net.Mime;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

[assembly: AtlasServiceAssembly(AtlasServiceNames.WebApp)]
namespace LDC.Atlas.WebApp.Configuration
{
    [System.Diagnostics.CodeAnalysis.ExcludeFromCodeCoverage]
    public class Startup
    {
        public Startup(IHostingEnvironment env, IConfiguration configuration)
        {
            CurrentEnvironment = env;
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public IHostingEnvironment CurrentEnvironment { get; set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHealthChecks()
                .AddCheck("self", () => HealthCheckResult.Healthy());

            if (!CurrentEnvironment.IsDevelopment())
            {
                services.AddHealthChecksUI();
            }

            services.AddMvc(options =>
                {
                    options.Filters.Add<AtlasLogEnrichmentFilter>();
                })
                .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
                .AddJsonOptions(opt =>
                {
                    opt.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
                    opt.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                    opt.SerializerSettings.DateParseHandling = DateParseHandling.DateTime;
                    opt.SerializerSettings.Formatting = Formatting.Indented;

                    opt.SerializerSettings.Converters.Add(new TrimmingConverter());
                });

            // This code is added AFTER app.UseMvc(); otherwise it will not work.
            services.ConfigureInvalidModelStateResponseFactory();

            services.AddSingleton<ITelemetryInitializer, ServiceContextTelemetryIntitializer>();
            services.AddApplicationInsightsTelemetry(Configuration);

            services.AddApplicationInsightsKubernetesEnricher();

            services.AddCors(options =>
            {
                options.AddPolicy(
                    "CorsPolicy",
                    builder => builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials());
            });

            services.Configure<Models.ApplicationDetail>(Configuration.GetSection("AtlasApplication"));
            services.Configure<Models.OAuthEndpoints>(Configuration.GetSection("ClientOAuth2Config"));
            services.Configure<ApplicationInsightsConfiguration>(Configuration.GetSection("ApplicationInsights"));

            // Adds a default implementation for IHttpContextAccessor
            services.AddHttpContextAccessor();

            services.AddAtlasIdentityService();

            // Add Authentication services.
            services.AddAuthentication(sharedOptions =>
            {
                sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

                // sharedOptions.DefaultChallengeScheme = OpenIdConnectDefaults.AuthenticationScheme;
            })

            // Configure the OWIN pipeline to use cookie auth.
            .AddJwtBearer(cfg =>
           {
               cfg.Audience = Configuration["OAuth2:ClientId"];
               cfg.Authority = Configuration["OAuth2:Authority"];
               cfg.RequireHttpsMetadata = false;
           });

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (!env.IsDevelopment())
            {
                app.UseHealthChecksUI();
            }

            app.UseHealthChecks("/hc/self", new HealthCheckOptions
            {
                Predicate = r => r.Name.Contains("self", StringComparison.InvariantCultureIgnoreCase)
            });

            app.UseHealthChecks("/hc/ready", new HealthCheckOptions
            {
                // Predicate = r => r.Tags.Contains("services")
            });

            app.UseHealthChecks("/hc/uiresponse", new HealthCheckOptions
            {
                ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
            });

            app.UseHealthChecks(
                "/hc",
                new HealthCheckOptions
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

            app.UseSecurityHeaders();

            app.UseAuthentication();

            var config = Configuration.GetSection("AtlasApplication").Get<Models.ApplicationDetail>();
            var cookieOptions = new Microsoft.AspNetCore.Http.CookieOptions()
            {
                Path = "/",
                HttpOnly = false,
                IsEssential = true
            };

            app.Use(async (context, next) =>
            {
                await next();
                var path = context.Request.Path.Value;

                if (context.Response.StatusCode == 404 &&
                    (!Path.HasExtension(path) || (Path.HasExtension(path) &&
                        Regex.IsMatch(Path.GetExtension(path), @"[\d|\D]\d\d"))) &&
                    !path.StartsWith("/api/", StringComparison.Ordinal))
                {

                    context.Request.Path = "/";
                    await next();
                }
            });

            app.UseMvcWithDefaultRoute();
            app.UseDefaultFiles();
            app.UseStaticFiles(new StaticFileOptions()
            {
                OnPrepareResponse = (ctx) =>
                {
                    if (ctx.Context.Request.Path == "/index.html") { 
                        ctx.Context.Response.Cookies.Delete("EnvSuffix");
                        ctx.Context.Response.Cookies.Append("EnvSuffix", config.WebAppRoot, cookieOptions);
                    }
                }
            });
        }

        // Handle sign-in errors differently than generic errors.
        private Task OnAuthenticationFailed(RemoteFailureContext context)
        {
            context.HandleResponse();
            context.Response.Redirect("/Home/Error?message=" + context.Failure.Message);
            return Task.FromResult(0);
        }
    }
}
