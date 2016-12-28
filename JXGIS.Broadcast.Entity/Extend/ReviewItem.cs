using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace JXGIS.Broadcast.Entity
{
    public class ReviewItem
    {
        public string SourceID { get; set; }

        public string Title { get; set; }
        public string Content { get; set; }

        public DateTime? Date { get; set; }

        public string SourceType { get; set; }

        public string Catagory { get; set; }

        public string Geometry { get; set; }

        public string Link { get; set; }
    }
}
