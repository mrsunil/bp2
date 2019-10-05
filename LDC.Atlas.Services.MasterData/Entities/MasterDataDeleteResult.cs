namespace LDC.Atlas.Services.MasterData.Entities
{
    public class MasterDataDeleteResult
    {
        public int DeleteResultId { get; set; }

        public int? ErrorCode { get; set; }

        public long MasterDataId { get; set; }

        public string MasterDataCode { get; set; }

        public int? TransactionState { get; set; }

        public string ErrorMessage { get; set; }

        public MasterDataOperationStatus GetMasterDataOperationStatus()
        {
            if (MasterDataCode == null)
            {
                return MasterDataOperationStatus.RessourceNotFound;
            }
            else if (ErrorCode == null)
            {
                return MasterDataOperationStatus.Success;
            }
            else if (ErrorCode == 547)
            {
                return MasterDataOperationStatus.ForeignKeyViolation;
            }
            else
            {
                return MasterDataOperationStatus.UnknownError;
            }
        }
    }
}
