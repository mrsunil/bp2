using Newtonsoft.Json;
using System.Xml.Serialization;

namespace LDC.Atlas.Services.GenericBackInterface.Entities
{
    public class Message
    {
        public Functionalack functionalAck { get; set; }
    }

    public class Functionalack
    {
        public Functionaldocid functionalDocId { get; set; }

        public Header[] header { get; set; }

        public Item[] items { get; set; }
    }

    public class Functionaldocid
    {
        public string originalBusinessDocID { get; set; }

        public string businessAppID { get; set; }

        public string businessEntity { get; set; }

        public string businessDocID { get; set; }

        public string userID { get; set; }
    }

    public class Header
    {
        public string originalBusinessObject { get; set; }

        public string origMessageId { get; set; }

        public string originalBusinessOperation { get; set; }

        public string ackBusinessApplication { get; set; }

        public string origMessageTimeStamp { get; set; }

        public string status { get; set; }
    }

    public class Item
    {
        public string ackBusinessEntity { get; set; }

        public Lineitemack[] lineItemAck { get; set; }

        public string ackBusinessDocId { get; set; }
    }

    public class Lineitemack
    {
        public string returnMessage { get; set; }

        public Parameter[] parameters { get; set; }

        public string origItemNumber { get; set; }
    }

    public class Parameter
    {
        public string parameterName { get; set; }

        public string value { get; set; }
    }

    [XmlRoot(ElementName = "error")]
    public class MessageError
    {
        [XmlText]
        [JsonProperty(PropertyName = "error")]
        public string Text { get; set; }
    }
}
