// <copyright file="FeatureResult.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

namespace LDC.Atlas.Services.Configuration.Entities
{
    /// <summary>
    /// Flag operation result information.
    /// </summary>
    public class FeatureResult
    {
        /// <summary>
        /// Gets or sets gap Name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether result of the flag evaluation.
        /// </summary>
        public bool Active { get; set; }
    }
}
