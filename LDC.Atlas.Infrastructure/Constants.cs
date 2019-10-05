namespace LDC.Atlas.Infrastructure
{
    public static class AzureAdClaimTypes
    {
        public const string TenantId = "http://schemas.microsoft.com/identity/claims/tenantid";
        public const string ObjectId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
    }

    public static class AtlasClaimTypes
    {
        public const string AtlasId = "urn:ldc:atlas:identity:claims:id";
        public const string UniqueName = "unique_name";
        public const string Subject = "sub";
        public const string ObjectIdentifier = "oid";
    }

    public static class AtlasHeaderNames
    {
        public const string AtlasProgramId = "Atlas-Program-Id";
    }

    public static class AtlasStandardPolicies
    {
        public const string TradingAreaPolicy = "TradingAreaPolicy";
        public const string ControllingAreaPolicy = "ControllingAreaPolicy";
        public const string PreAccountingAreaPolicy = "PreAccountingAreaPolicy";
        public const string ExecutionAreaPolicy = "ExecutionAreaPolicy";
        public const string MasterDataAreaPolicy = "MasterDataAreaPolicy";
        public const string AdministratorAreaPolicy = "AdministratorAreaPolicy";
    }

    public static class AtlasServiceNames
    {
        public const string WebApp = "WebApp";
        public const string Trading = "Trading";
        public const string MasterData = "MasterData";
        public const string Execution = "Execution";
        public const string Controlling = "Controlling";
        public const string UserIdentity = "UserIdentity";
        public const string PreAccounting = "PreAccounting";
        public const string Document = "Document";
        public const string Configuration = "Configuration";
        public const string Freeze = "Freeze";
        public const string Reporting = "Reporting";
        public const string Lock = "Lock";
        public const string AccountingInterface = "AccountingInterface";
        public const string GenericBackInterface = "GenericBackInterface";
        public const string PaymentRequestInterface = "PaymentRequestInterface";
        public const string Interface = "Interface";
        public const string Audit = "Audit";
    }
}
