using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Services.PreAccounting.Entities
{
    public class PaymentOrderCreatedRecord
    {
        [Required]
        public string DocumentReference { get; set; }

        [Required]
        public IEnumerable<PayedInvoice> PayedInvoices { get; set; }

        public string Company { get; set; }
    }

    public class PayedInvoice
    {
        [Required]
        public int InvoiceId { get; set; }

        [Required]
        public decimal AmountToPay { get; set; }
    }
}
