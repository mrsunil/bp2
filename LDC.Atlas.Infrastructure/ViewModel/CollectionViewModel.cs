using Newtonsoft.Json;
using System.Collections.Generic;
using System.Collections.ObjectModel;

namespace LDC.Atlas.Infrastructure.ViewModel
{
    public class CollectionViewModel<TEntity>
        where TEntity : class
    {
        [JsonProperty("value")]
        private ReadOnlyCollection<TEntity> _value;

        // Parameterless constructor used for deserialization
        public CollectionViewModel()
        {
        }

        public CollectionViewModel(IList<TEntity> items)
        {
            if (items == null)
            {
                throw new System.ArgumentNullException(nameof(items));
            }

            _value = new ReadOnlyCollection<TEntity>(items);
        }

        [JsonIgnore]
        public ReadOnlyCollection<TEntity> Value { get => _value; }
    }
}
