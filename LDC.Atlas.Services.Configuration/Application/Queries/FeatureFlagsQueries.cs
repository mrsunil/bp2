// <copyright file="FeatureFlagsQueries.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

using AutoMapper;
using Dapper;
using LDC.Atlas.DataAccess;
using LDC.Atlas.Services.Configuration.Application.Queries.Dto;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace LDC.Atlas.Services.Configuration.Application.Queries
{
    /// <summary>
    /// Query component of feature flags.
    /// </summary>
    public class FeatureFlagsQueries : BaseRepository, IFeatureFlagsQueries
    {
        private const string WildcardCompany = "*";
        private readonly IMapper mapper;

        /// <summary>
        /// Initializes a new instance of the <see cref="FeatureFlagsQueries"/> class.
        /// </summary>
        /// <param name="dapperContext">Dapper context for data access.</param>
        /// <param name="mapper">Mapper instance.</param>
        public FeatureFlagsQueries(
            IDapperContext dapperContext,
            IMapper mapper)
            : base(dapperContext)
        {
            this.mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        /// <summary>
        /// Returns the status of the feature bit based on the gap name.
        /// </summary>
        /// <param name="company">Company to query.</param>
        /// <param name="gapName">Name of the gap to query.</param>
        /// <returns>Returns the feature instance for the company and gap name.</returns>
        public async Task<FeatureBitDto> GetFeatureFlagAsync(string company, string gapName)
        {
            DynamicParameters queryParameters = new DynamicParameters();
            queryParameters.Add("@iName", gapName);
            var featureBit = (await this.ExecuteQueryAsync<FeatureBitDto>(StoredProcedureNames.GetFeatureBit, queryParameters).ConfigureAwait(false)).FirstOrDefault();
            if (featureBit != null)
            {
                return featureBit.AllowedCompanies.Contains(company, StringComparison.CurrentCulture) || featureBit.AllowedCompanies.Contains(WildcardCompany, StringComparison.CurrentCulture) ? featureBit : null;
            }
            else
            {
                return null;
            }
        }

        private static class StoredProcedureNames
        {
            internal const string GetFeatureBit = "[Crosscutting].[usp_GetFeatureBit]";
        }
    }
}
