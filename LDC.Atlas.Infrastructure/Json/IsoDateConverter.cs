using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;

namespace LDC.Atlas.Infrastructure.Json
{
    public class IsoDateConverter : IsoDateTimeConverter
    {
        public IsoDateConverter()
        {
            DateTimeFormat = "yyyy-MM-dd";
            DateTimeStyles = System.Globalization.DateTimeStyles.AssumeUniversal;
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            /*serializer.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
            serializer.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            serializer.DateParseHandling = DateParseHandling.DateTime;*/

            return base.ReadJson(reader, objectType, existingValue, serializer);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            /*serializer.DateTimeZoneHandling = DateTimeZoneHandling.Utc;
            serializer.DateFormatHandling = DateFormatHandling.IsoDateFormat;
            serializer.DateParseHandling = DateParseHandling.DateTime;*/

            base.WriteJson(writer, value, serializer);
        }
    }
}
