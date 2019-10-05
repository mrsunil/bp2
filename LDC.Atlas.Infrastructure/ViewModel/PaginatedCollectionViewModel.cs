using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace LDC.Atlas.Infrastructure.ViewModel
{
    public class PaginatedCollectionViewModel<TEntity> : CollectionViewModel<TEntity>
        where TEntity : class
    {
        // Parameter-less constructor used for deserialization
        public PaginatedCollectionViewModel()
        {
        }

        public PaginatedCollectionViewModel(int offset, int limit, IList<TEntity> items, long? count = null)
            : base(items)
        {
            Offset = offset;
            Limit = limit;
            Count = count;
        }

        /// <summary>
        ///     Gets or sets the offset of the current page.
        /// </summary>
        /// <value>The offset of the current page.</value>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = 1)]
        public int? Offset { get; set; }

        /// <summary>
        ///     Gets or sets the limit of the current paging options.
        /// </summary>
        /// <value>The limit of the current paging options.</value>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = 2)]
        public int? Limit { get; set; }

        /// <summary>
        ///     Gets the number of items in the collection (irrespective of any paging options).
        /// </summary>
        /// <value>The total number of items in the collection.</value>
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore, Order = 3)]
        public long? Count { get; private set; }
    }

    public static class PaginatedCollectionViewModelExtensions
    {
        /// <summary>
        /// Creates a PaginatedCollectionViewModel based on a EntitySearchRequest.
        /// </summary>
        /// <typeparam name="TEntity">The type of the items.</typeparam>
        /// <param name="items">The items collection.</param>
        /// <param name="entitySearchRequest">An instance of EntitySearchRequest.</param>
        /// <param name="count">The total number of items.</param>
        public static PaginatedCollectionViewModel<TEntity> ToPaginatedCollectionViewModel<TEntity>(this IEnumerable<TEntity> items, EntitySearchRequest entitySearchRequest, int? count = null)
             where TEntity : Application.Core.Entities.PaginatedItem
        {
            return new PaginatedCollectionViewModel<TEntity>(entitySearchRequest.Offset.Value, entitySearchRequest.Limit.Value, items.ToList(), count ?? (items.FirstOrDefault()?.TotalCount ?? 0));
        }
    }
}
