using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    public class POIItem
    {
        public string address { get; set; }

        public string code { get; set; }

        public string id { get; set; }

        public string layer { get; set; }

        public string name { get; set; }

        public string pac { get; set; }

        public string photo { get; set; }

        public string weight { get; set; }

        [JsonProperty(PropertyName = "x")]
        private string _x { get; set; } = "0";

        [JsonIgnore]
        public double x
        {
            get
            {
                return double.Parse(this._x);
            }
        }

        [JsonProperty(PropertyName = "y")]
        private string _y { get; set; } = "0";

        [JsonIgnore]
        public double y
        {
            get
            {
                return double.Parse(this._y);
            }
        }

    }
}
