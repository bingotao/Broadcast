using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    public class POIObject
    {
        [JsonProperty(PropertyName = "costtime")]
        private string _costtime { get; set; }

        [JsonIgnore]
        public double costtime
        {
            get { return double.Parse(this._costtime); }
        }

        [JsonProperty(PropertyName = "counts")]
        private string _counts { get; set; }

        [JsonIgnore]
        public int counts
        {
            get { return int.Parse(this._counts); }
        }

        public string keyword { get; set; }

        public POIItem[] records { get; set; }
    }
}