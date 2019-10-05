// <copyright file="FeatureBitEvaluator.cs" company="Avanade">
// Copyright (c) Avanade. All rights reserved.
// </copyright>

using LDC.Atlas.Services.Configuration.Entities;
using System;
using System.Linq;

namespace LDC.Atlas.Services.Configuration.Services
{
    /// <summary>
    /// This class allows the user of the class to determine if a particular feature should be turned on or off.
    /// </summary>
    public class FeatureBitEvaluator : IFeatureBitEvaluator
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="FeatureBitEvaluator"/> class.
        /// </summary>
        /// <param name="definitions">Object used to read the Feature Bits</param>
        public FeatureBitEvaluator()
        {
        }

        /// <summary>
        /// Indacicates if a given feature is enabled or not.
        /// </summary>
        /// <param name="feature">Feature </param>
        /// <returns>Returns the boolean value of the feature status.</returns>
        public bool IsEnabled (IFeatureBitDefinition feature)
        {
            if (feature != null)
            {
                return EvaluateBitValue(feature);
            }
            else
            {
                throw new ArgumentNullException(nameof(feature));
            }
        }

        private static bool EvaluateBitValue(IFeatureBitDefinition bitDef)
        {
            bool result;
            if (bitDef.ExcludedEnvironments?.Length > 0)
            {
                result = EvaluateEnvironmentBasedFeatureState(bitDef);
            }
            else
            {
                result = bitDef.IsOnOff;
            }

            return result;
        }

        private static bool EvaluateEnvironmentBasedFeatureState(IFeatureBitDefinition bitDef)
        {
            bool featureState;
            var env = SystemContext.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")?.ToUpperInvariant();
            var environmentAry = bitDef.ExcludedEnvironments.ToUpperInvariant().Split(',');
            featureState = !environmentAry.Contains(env);
            return featureState;
        }
    }
}
