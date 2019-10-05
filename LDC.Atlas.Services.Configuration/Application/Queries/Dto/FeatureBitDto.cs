// <copyright file="FeatureBitDto.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

namespace LDC.Atlas.Services.Configuration.Application.Queries.Dto
{
    /// <summary>
    /// Feature Bit data model definition.
    /// </summary>
    public class FeatureBitDto
    {
        /// <summary>
        /// Gets or sets the Id of the model.
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the Name of the model.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the feature is activated or not.
        /// </summary>
        public bool IsOnOff { get; set; }

        /// <summary>
        /// Gets or sets the excluded environments of the model where the feature is fixed to be disabled.
        /// </summary>
        public string ExcludedEnvironments { get; set; }

        /// <summary>
        /// Gets or sets the allowed companies of the model.
        /// </summary>
        public string AllowedCompanies { get; set; }
    }
}
