using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace LDC.Atlas.Infrastructure.ViewModel
{
    public sealed class PagingOptions
    {
        public const int MaxPageSize = int.MaxValue;

        [FromQuery]
        [Range(0, int.MaxValue, ErrorMessage = "Offset must be equal or greater than 0.")]
        public int? Offset { get; set; } = 0;

        [FromQuery]
        [Range(1, MaxPageSize, ErrorMessage = "Limit must be greater than 0 and less than int.MaxValue.")]
        public int? Limit { get; set; } = MaxPageSize;
    }
}