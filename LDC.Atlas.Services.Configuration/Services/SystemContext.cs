// <copyright file="SystemContext.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

using System;

namespace LDC.Atlas.Services.Configuration.Services
{
    /// <summary>
    /// Context class for environment management on FeatureBits.
    /// </summary>
    public static class SystemContext
    {
        [ThreadStatic]
        private static Func<string, string> _getEnvironmentVariable;

        /// <summary>
        /// Gets or sets the environment variable.
        /// </summary>
        public static Func<string, string> GetEnvironmentVariable
        {
            get => _getEnvironmentVariable ?? (_getEnvironmentVariable = Environment.GetEnvironmentVariable);
            set => _getEnvironmentVariable = value;
        }
    }
}
