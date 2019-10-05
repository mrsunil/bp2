namespace LDC.Atlas.MasterData.Common.Entities
{
    public class Address
    {
        public int Id { get; set; }

        public string Title { get; set; }

        public string Line1 { get; set; }

        public string Line2 { get; set; }

        public string Line3 { get; set; }

        public int ZipCode { get; set; }

        public string City { get; set; }

        public string Country { get; set; }
    }
}
