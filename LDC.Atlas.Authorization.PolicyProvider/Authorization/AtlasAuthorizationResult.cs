using System.Collections.Generic;

namespace LDC.Atlas.Authorization.PolicyProvider.Authorization
{
    public class AtlasAuthorizationResult
    {
        public bool Succeeded { get; set; }

        public List<string> Errors { get; } = new List<string>();
    }
}
