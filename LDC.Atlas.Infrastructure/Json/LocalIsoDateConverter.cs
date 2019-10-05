using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace LDC.Atlas.Infrastructure.Json
{
    public class LocalIsoDateConverter : IsoDateTimeConverter
    {
        public LocalIsoDateConverter()
        {
            DateTimeFormat = "yyyy-MM-ddTHH:mm:ss";
            DateTimeStyles = System.Globalization.DateTimeStyles.AssumeLocal;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return base.ReadJson(reader, objectType, existingValue, serializer);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            base.WriteJson(writer, value, serializer);
        }
    }
}
