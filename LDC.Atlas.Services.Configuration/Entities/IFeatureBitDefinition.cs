// <copyright file="IFeatureBitDefinition.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

using System.Collections.Generic;

namespace LDC.Atlas.Services.Configuration.Entities
{
    /// <summary>
    /// Interface definition for Feature Bit toogle.
    /// </summary>
    public interface IFeatureBitDefinition
    {
        /// <summary>
        /// Gets or sets the unique ID of the feature bit.
        /// </summary>
        int Id { get; set; }

        /// <summary>
        /// Gets or sets the unique name of the feature bit.
        /// </summary>
        string Name { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether gets or sets if the feature is active or not.
        /// </summary>
        bool IsOnOff { get; set; }

        /// <summary>
        /// Gets or sets the environments where the feature is desactivated.
        /// </summary>
        string ExcludedEnvironments { get; set; }

        /// <summary>
        /// Gets or sets a list of companies where the gap is registered.
        /// </summary>
        IEnumerable<string> AllowedCompanies { get; set; }
    }
}
