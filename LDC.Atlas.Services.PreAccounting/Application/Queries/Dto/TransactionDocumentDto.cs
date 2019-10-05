namespace LDC.Atlas.Services.PreAccounting.Application.Queries.Dto
{
    public class TransactionDocumentDto
    {
        public int TransactionDocumentTypeId { get; set; }

        public string Label { get; set; }

        public bool AuthorizedForPosting { get; set; }

        public short? JLTypeId { get; set; }

        public bool ToInterface { get; set; }
    }
}
