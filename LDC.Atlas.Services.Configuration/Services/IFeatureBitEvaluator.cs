// <copyright file="IFeatureBitEvaluator.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

using LDC.Atlas.Services.Configuration.Entities;

namespace LDC.Atlas.Services.Configuration.Services
{
    /// <summary>
    /// Interface of the evaluator of the feature bit functionality.
    /// </summary>
    public interface IFeatureBitEvaluator
    {
        /// <summary>
        /// Determine if a feature should be enabled or disabled.
        /// </summary>
        /// <param name="feature">Feature to be chedked</param>
        /// <returns>True if the feature is enabled.</returns>
        bool IsEnabled(IFeatureBitDefinition feature);
    }
}
